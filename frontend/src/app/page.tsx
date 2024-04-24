import React from "react";
import KeywordList from "@/components/KeywordList";
import UploadFiles from "@/components/UploadFiles";
import validateAccessToken from "@/services/validateAccessToken";
import PagePreview from "@/components/ScrapedPagePreview";
import DownloadSampleFileButton from "../components/DownloadSampleFileButton";
import FileUploader from "@/components/FileUploader";

export default async function Home(props: any) {
  await validateAccessToken();

  return (
    <main id="main-box">
      <div id="main-content-wrapper">
        <div id="actions-box" className="action-box">
          <FileUploader />
          <DownloadSampleFileButton />
        </div>
        <div id="result-box" className=" flex flex-1 divide-x overflow-hidden">
          <UploadFiles {...props} />
          <KeywordList {...props} />
          <PagePreview {...props} />
        </div>
      </div>
    </main>
  );
}
