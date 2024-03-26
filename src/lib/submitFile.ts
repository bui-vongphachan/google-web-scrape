"use server";

import { CSVFile, Keyword } from "@prisma/client";
import { generateUniqueIdentifier } from "./generateUniqueIdentifier";

export default async function submitFile(prevState: any, formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return {
      message: "Please select a file",
    };
  }

  const fileId = generateUniqueIdentifier();

  const newFile: CSVFile = {
    id: fileId,
    name: file.name,
    createdAt: new Date(),
  };

  await prisma?.cSVFile.create({
    data: newFile,
  });

  const list = await file.text().then((text) =>
    text
      .split("\n")
      .filter((item) => item !== "")
      .map((item) => {
        const keyword: Keyword = {
          id: generateUniqueIdentifier(),
          keyword: item,
          csvFileId: fileId,
          createdAt: new Date(),
        };

        return keyword;
      })
  );

  await prisma?.keyword.createMany({
    data: list,
  });

  // const url = new URL("https://www.googleapis.com/customsearch/v1");

  // url.searchParams.append("key", "AIzaSyCA6EfZc3lvCuHs_mGsiv1Baofva1yFwXo");
  // url.searchParams.append("cx", "1666bc89aa1074d09");

  const corsProxyUrl = "http://localhost:8080/";
  const url = `${corsProxyUrl}https://www.google.com/search?q=`;

  const mapList = new Map();

  const pending = list.map(async (item) => {
    // url.searchParams.append("q", item.keyword);
    // url.searchParams.append("quotaUser", generateUniqueIdentifier());

    const response = await fetch(url + item.keyword, {
      headers: { "x-requested-with": "xmlhttprequest" },
    });

    const html = await response.text();

    mapList.set(item.keyword, html);
  });

  await Promise.all(pending);

  return {
    message: "Success",
    data: mapList,
  };
}
