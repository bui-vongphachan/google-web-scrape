"use client";

import { CSVFile } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  file: CSVFile;
}

export default function CSVItem(props: Props) {
  const initialSearchParams = useSearchParams();

  const link = React.useMemo(() => {
    const searchParams = new URLSearchParams(initialSearchParams);

    searchParams.set("file", props.file.id);

    return searchParams.toString();
  }, [initialSearchParams, props.file.id]);

  return (
    <Link key={props.file.id} href={`?${link}`}>
      <div className=" cursor-pointer hover:bg-gray-100 p-2">
        <p>{props.file.name}</p>
        <div className=" flex flex-col">
          <small>{props.file.createdAt.toISOString().substring(0, 10)}</small>
          <small>
            {props.file.createdAt.toLocaleTimeString("en-US", {
              hour12: false,
            })}
          </small>
        </div>
      </div>
    </Link>
  );
}
