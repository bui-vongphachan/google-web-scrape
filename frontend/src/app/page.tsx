import React from "react";
import KeywordList from "@/components/page/home/KeywordList";
import UploadFiles from "@/components/page/home/UploadFiles";
import validateAccessToken from "@/services/validateAccessToken";
import Appbar from "@/components/page/home/Appbar";
import PagePreview from "@/components/page/home/Preview";

export default async function Home(props: any) {
  await validateAccessToken();

  return (
    <main id="main-box">
      <div id="main-content-wrapper">
        <Appbar />
        <div id="result-box" className=" flex flex-1 divide-x overflow-hidden">
          <UploadFiles {...props} />
          <KeywordList {...props} />
          <PagePreview {...props} />
        </div>
      </div>
    </main>
  );
}
