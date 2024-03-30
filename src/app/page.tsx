import React from "react";
import KeywordList from "@/components/KeywordList";
import CSVList from "@/components/CSVList";
import ResultPreview from "@/components/ResultPreview";
import validateAccessToken from "@/lib/validateAccessToken";
import Appbar from "./Appbar";

export default async function Home(props: any) {
  const user = await validateAccessToken();

  return (
    <main id="main-box">
      <div id="main-content-wrapper">
        <Appbar />
        <div id="result-box" className=" flex flex-1 divide-x overflow-hidden">
          <CSVList {...props} />
          <KeywordList {...props} />
          <ResultPreview {...props} />
        </div>
      </div>
    </main>
  );
}
