"use client";

import { Keyword } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  key: string;
  keyword: Keyword;
}

export default function KeywordItem(props: Props) {
  const initialSearchParams = useSearchParams();

  const link = React.useMemo(() => {
    const searchParams = new URLSearchParams(initialSearchParams);

    searchParams.set("keyword", props.keyword.keyword);

    return searchParams.toString();
  }, [initialSearchParams, props.keyword.keyword]);

  return (
    <Link key={props.key} href={`?${link}`}>
      <div className=" p-2 border-b cursor-pointer hover:bg-gray-100">
        <p>{props.keyword.keyword}</p>
      </div>
    </Link>
  );
}
