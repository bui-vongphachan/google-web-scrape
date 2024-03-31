import prisma from "@/lib/prisma";
import React from "react";
import { decompress } from "shrink-string";

export default async function PagePreview(props: any) {
  if (!props.searchParams.keyword) return <div></div>;

  const keyword = await prisma.keyword.findFirst({
    where: {
      id: props.searchParams.keyword,
    },
  });

  if (!keyword) return <div></div>;

  const page = await prisma.pageSourceCode.findFirst({
    where: {
      keyword: keyword.compactKeyword,
    },
  });

  const sourceCode = await decompress(page?.compressedSourceCode);

  return (
    <div id="page-preview" className=" flex-1 ">
      <iframe
        id="search-content"
        title="Rendered HTML"
        srcDoc={sourceCode}
        className=" w-full h-full"
      />
    </div>
  );
}
