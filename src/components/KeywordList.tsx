import KeywordItem from "./KeywordItem";

export default async function KeywordList(props: any) {
  if (props.searchParams.file === undefined) {
    return <div></div>;
  }

  const keywords = await prisma?.keyword.findMany({
    where: {
      csvFileId: props.searchParams.file,
    },
  });

  return (
    <div id="file-contents-box" className=" w-full max-w-56">
      <div className=" flex flex-col  overflow-scroll h-full">
        {keywords?.map((keyword, keywordIndex) => (
          <KeywordItem key={keywordIndex + ""} keyword={keyword} />
        ))}
      </div>
    </div>
  );
}
