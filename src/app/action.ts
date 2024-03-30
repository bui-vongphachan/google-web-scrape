"use server";

import { generateUniqueIdentifier } from "@/lib/generateUniqueIdentifier";
import prisma from "@/lib/prisma";
import { Keyword } from "@prisma/client";
import { decompress } from "shrink-string";

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

  const file = formData.get("file") as File | null;

  if (!file) {
    return {
      message: "Please select a file",
      data: [],
    };
  }

  const list = await file
    .text()
    .then((text) => text.split("\n").filter((item) => item !== ""));

  if (list.length > 100) {
    return {
      message: "You are only allowed to search up to 5 keywords",
      data: [],
    };
  }

  const fileId = generateUniqueIdentifier();

  const newFile: any = {
    id: fileId,
    name: file.name,
    createdAt: new Date(),
  };

  await prisma.cSVFile.create({
    data: newFile,
  });

  await prisma?.keyword.createMany({
    data: list.map((item) => {
      const keyword: Keyword = {
        id: generateUniqueIdentifier(),
        keyword: item,
        csvFileId: fileId,
        createdAt: new Date(),
      };

      return keyword;
    }),
  });

  const url = "http://localhost:8000/api/search";

  const chunks = [];

  for (let i = 0; i < list.length; i += 20) {
    chunks.push(list.slice(i, i + 20));
  }

  const pendingResponses: { keyword: string }[][] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log("CHUCK !!!!", i);

    const data = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: chunks[i] }),
    })
      .then((response) => response.json())
      .then((data: { keyword: string }[]) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

    if (!data) continue;

    if (data) pendingResponses.push(data);
  }

  const responses = (await Promise.all(pendingResponses)).flat();

  const pendingActualResults = responses.map(async (item) => {
    const key = Object.keys(item)[0];
    const value = Object.values(item)[0];
    return {
      [key]: await decompress(value),
    };
  });

  const result = await Promise.all(pendingActualResults);

  return {
    message: "Success",
    data: result,
  };
}
