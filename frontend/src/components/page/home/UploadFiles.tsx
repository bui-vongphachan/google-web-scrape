import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function UploadFiles(props: any) {
  const cookie = cookies();

  const userid = cookie.get("id")?.value;

  const files = await prisma.uploadedFile.findMany({
    where: {
      userId: userid,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div id="file-list-box" className=" w-full max-w-48">
      <div className=" flex flex-col overflow-scroll h-full divide-y border-b">
        {files.map((file) => {
          const url = `?file=${file.id}`;
          return (
            <Link key={file.id} href={url}>
              <div className=" cursor-pointer hover:bg-gray-100 p-2">
                <p>{file.name}</p>
                <div className=" flex flex-col">
                  <small>{file.createdAt.toISOString().substring(0, 10)}</small>
                  <small>
                    {file.createdAt.toLocaleTimeString("en-US", {
                      hour12: false,
                    })}
                  </small>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
