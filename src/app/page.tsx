import React from "react";
import FileInput from "@/components/FileInput";
import KeywordList from "@/components/KeywordList";
import CSVList from "@/components/CSVList";
import ExampleFileButton from "@/components/ExampleFileButton";
import ResultPreview from "@/components/ResultPreview";

export default async function Home(props: any) {
  return (
    <main id="main-box" className=" mx-auto flex max-w-7xl h-screen p-12">
      <div id="wrapper" className=" border rounded-md w-full flex flex-col ">
        <div id="actions-box" className=" flex border-b">
          <FileInput />
          <ExampleFileButton />
        </div>
        <div id="result-box" className=" flex flex-1 divide-x overflow-hidden">
          <CSVList {...props} />
          <KeywordList {...props} />
          <ResultPreview {...props} />
        </div>
      </div>
    </main>
  );
}
