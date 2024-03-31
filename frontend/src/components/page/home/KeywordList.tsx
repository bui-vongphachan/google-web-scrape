import prisma from "@/lib/prisma";
import Link from "next/link";
import { Keyword } from "@prisma/client";

interface KeywordItemType extends Keyword {
  stats: string;
  total_links: number;
  adwords: number;
}

export default async function KeywordList(props: any) {
  if (props.searchParams.file === undefined) {
    return <div></div>;
  }

  const keywords: KeywordItemType[] = await prisma.$queryRaw`
  SELECT 
      keyword.*,
      page_source_codes.stats,
      page_source_codes.total_links,
      page_source_codes.adwords
    FROM keywords AS keyword
    LEFT JOIN page_source_codes AS page_source_codes 
      ON page_source_codes.keyword = keyword.compact_keyword
  WHERE keyword.file_id = ${props.searchParams.file}
  `;

  return (
    <div id="file-contents-box" className=" w-full max-w-56">
      <div className=" flex flex-col  overflow-scroll h-full">
        {keywords?.map((keyword) => {
          const url = `?file=${props.searchParams.file}&keyword=${keyword.id}`;

          return (
            <Link key={keyword.id} href={url}>
              <div className=" p-2 border-b cursor-pointer hover:bg-gray-100 text-neutral-700">
                <p>{keyword.keyword}</p>
                <div className=" flex flex-col text-neutral-500">
                  <small>{keyword.stats.replace(/<[^>]*>/g, "")}</small>
                  <small>{keyword.total_links} links</small>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
