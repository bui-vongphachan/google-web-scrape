"use server";

import {
  CSVFile,
  GoogleSearchInfo,
  GoogleSearchItems,
  Keyword,
} from "@prisma/client";
import { generateUniqueIdentifier } from "./generateUniqueIdentifier";
import prisma from "./prisma";

export default async function submitFile(
  prevState: any,
  formData: FormData
): Promise<{
  message: string;
  data: {
    searchInformation: GoogleSearchInfo;
    items?: GoogleSearchItems[];
  }[];
}> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return {
      message: "Please select a file",
      data: [],
    };
  }

  const fileId = generateUniqueIdentifier();

  const newFile: CSVFile = {
    id: fileId,
    name: file.name,
    createdAt: new Date(),
  };

  await prisma.cSVFile.create({
    data: newFile,
  });

  const list = await file
    .text()
    .then((text) => text.split("\n").filter((item) => item !== ""));

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

  const url = new URL("https://www.googleapis.com/customsearch/v1");

  url.searchParams.append("key", "AIzaSyCA6EfZc3lvCuHs_mGsiv1Baofva1yFwXo");
  url.searchParams.append("cx", "1666bc89aa1074d09");

  const pending = list.map(async (keyword) => {
    url.searchParams.append("q", keyword);
    url.searchParams.append("quotaUser", generateUniqueIdentifier());

    const response = fetch(url.toString())
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

    const data = (await response) as {
      searchInformation: GoogleSearchInfo;
      items: GoogleSearchItems[];
    };

    const searchItems: GoogleSearchItems[] =
      data.items?.map((item) => {
        return {
          ...item,
          keyword: keyword,
          csvFileId: fileId,
          createdAt: new Date(),
        };
      }) || [];

    await prisma?.googleSearchItems.createMany({
      data: searchItems,
      skipDuplicates: true,
    });

    await prisma?.googleSearchInfo.create({
      data: {
        ...data.searchInformation,
        keyword: keyword,
        createdAt: new Date(),
      },
    });

    return data;
  });

  const searchResults = await Promise.all(pending);

  return {
    message: "Success",
    data: searchResults,
  };
}
