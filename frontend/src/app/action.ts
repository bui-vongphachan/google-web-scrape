"use server";

import { generateUniqueIdentifier } from "@/services/generateUniqueIdentifier";
import prisma from "@/lib/prisma";
import { Keyword, UploadedFile } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import amqp from "amqplib";

let connection: amqp.Connection | null = null;
const exchangeName = "search-exchange";
const queueName = "search-queue";

interface KeywordValuePair {
  [keyword: string]: string;
}

export interface ActionResult {
  message: string;
  data: KeywordValuePair[];
}

export default async function submitFile(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  prevState.message = "";
  prevState.data = [];

  const cookie = cookies();

  // validate token
  if (!cookie.has("token")) redirect("/login");

  const token = cookie.get("token")?.value;

  if (!token) redirect("/login");

  await new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
      if (err) redirect("/login");
    });

    resolve(null);
  });

  if (!cookie.has("id")) redirect("/login");

  const userId = cookie.get("id")?.value;

  if (!userId) redirect("/login");

  // Start rabbitmq connection
  if (connection === null) {
    connection = await amqp
      .connect(process.env.RABBITMQ_URL as string)
      .then((conn) => conn)
      .catch((err) => {
        console.log(err);
        return null;
      });
  }

  if (!connection) {
    return {
      message: "Failed to connect to RabbitMQ",
      data: [],
    };
  }

  // Don't share channels between requests
  const channel = await connection
    .createChannel()
    .then((channel) => channel)
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!channel) {
    return {
      message: "Failed to create channel",
      data: [],
    };
  }

  // Assert exchange before publishing message for fanout exchange.
  const reply = await channel
    .assertExchange(exchangeName, "fanout", {
      durable: false,
    })
    .then((reply) => reply)
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!reply) {
    return {
      message: "Failed to assert exchange",
      data: [],
    };
  }

  // Assert queue before binding it to the exchange (required for fanout exchange)
  const queue = await channel
    .assertQueue(queueName, { durable: false })
    .then((reply) => reply)
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (!queue) {
    return {
      message: "Failed to assert queue",
      data: [],
    };
  }

  // Create a file
  const file = formData.get("file") as File | null;

  if (!file) {
    return {
      message: "Please select a file",
      data: [],
    };
  }

  const fileId = generateUniqueIdentifier();

  const newFile: UploadedFile = {
    id: fileId,
    name: file.name,
    createdAt: new Date(),
    userId: userId,
  };

  await prisma.uploadedFile.create({ data: newFile });

  // Filter out existing keywords
  const list = await file
    .text()
    .then((text) => text.split("\n").filter((item) => item !== ""));

  if (list.length > 100) {
    return {
      message: "You are only allowed to search up to 5 keywords",
      data: [],
    };
  }

  const existingKeywords = await prisma.keyword.findMany({
    where: {
      keyword: {
        in: list,
      },
    },
  });

  const newKeywordsToSearch = list.filter(
    (item) => !existingKeywords.some((keyword) => keyword.keyword === item)
  );

  // Create keywords
  await prisma?.keyword.createMany({
    data: list.map((item) => {
      const keyword: Keyword = {
        id: generateUniqueIdentifier(),
        compactKeyword: item.toLowerCase().replace(/\s/g, ""),
        keyword: item,
        createdAt: new Date(),
        fileId: fileId,
      };

      return keyword;
    }),
  });

  // Splite keywords by 20 and publish to rabbitmq
  const promises = [];

  for (let i = 0; i < newKeywordsToSearch.length; i += 20) {
    const promise = new Promise((resolve) => {
      const chunks = newKeywordsToSearch.slice(i, i + 20);

      console.log(chunks);

      const buf = Buffer.from(JSON.stringify(chunks));

      channel.publish(exchangeName, "", buf);

      resolve(null);
    });

    promises.push(promise);
  }

  await Promise.all(promises);

  // await connection.close();

  console.log("File uploaded successfully");

  redirect("?message=File uploaded successfully");
}