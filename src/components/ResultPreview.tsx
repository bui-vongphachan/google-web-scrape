"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function ResultPreview(props: any) {
  const [htmlSourceCode, setHtmlSourceCode] = React.useState<string>("");

  const searchParams = useSearchParams();

  const getContent = React.useCallback((keyword: string) => {
    if (!keyword) return "";

    const contentBox = document.getElementById("search-content");
    if (!contentBox) return;

    contentBox.innerHTML = "";

    const request = window.indexedDB.open("PageSourceDB", 1);
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("PageSource", "readonly");
      const objectStore = transaction.objectStore("PageSource");
      const requestGet = objectStore.get(keyword);
      requestGet.onsuccess = function () {
        // contentBox.innerHTML = requestGet.result?.value;

        setHtmlSourceCode(requestGet.result?.value);
      };
    };
  }, []);

  React.useEffect(() => {
    (() => {
      const keyword = searchParams.get("keyword");

      if (!keyword) return;

      getContent(keyword);
    })();
  }, [searchParams, getContent]);

  return (
    <div id="search-result-box" className=" flex-1  ">
      <iframe
        id="search-content"
        title="Rendered HTML"
        srcDoc={htmlSourceCode}
        className=" w-full h-full"
      />
    </div>
  );
}
