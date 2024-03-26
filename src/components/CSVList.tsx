import prisma from "@/lib/prisma";
import CSVItem from "./CSVItem";

export default async function CSVList(props: any) {
  const files = await prisma.cSVFile.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div id="file-list-box" className=" w-40">
      <div className=" flex flex-col overflow-scroll h-full divide-y border-b">
        {files.map((file) => (
          <CSVItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
