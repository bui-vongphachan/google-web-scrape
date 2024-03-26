import React from "react";
import FileInput from "@/components/FileInput";
import KeywordList from "@/components/KeywordList";
import CSVList from "@/components/CSVList";
import ExampleFileButton from "@/components/ExampleFileButton";

export default async function Home(props: any) {
  /*   const KeywordListComponent: JSX.Element = await KeywordList({
    ...props,
  }); */

  return (
    <main className=" mx-auto flex max-w-7xl h-screen p-12">
      <div className="  border rounded-md flex flex-col ">
        <div className=" flex border-b">
          <FileInput />
          <ExampleFileButton />
        </div>
        <div id="result-box" className=" flex flex-1 divide-x overflow-hidden">
          <CSVList {...props} />
          <KeywordList {...props} />
          <div id="search-result-box" className=" flex-1  ">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias
            cupiditate, vel accusantium quo rerum ipsum accusamus eum esse ea
            exercitationem quisquam fugit beatae sunt molestiae quasi aliquid
            delectus? Tenetur, iste!
          </div>
        </div>
      </div>
    </main>
  );
}
