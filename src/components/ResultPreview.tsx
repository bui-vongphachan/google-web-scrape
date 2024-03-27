import getGoogleCustomSearchResult from "@/lib/getGoogleCustomSearchResult";
import React from "react";

export default async function ResultPreview(props: any) {
  const keyword = props.searchParams.keyword || "";

  const results = await getGoogleCustomSearchResult(keyword);

  if (!results.items) {
    if (results.error) {
      return <p>Error! {results.error.message}</p>;
    }
    return <p>Error!</p>;
  }

  return (
    <div
      id="result-previewer"
      className=" flex-1 px-12 pb-6 w-full flex flex-col overflow-scroll"
    >
      <p className=" my-3">
        About {results.searchInformation?.formattedTotalResults} results (
        {results.searchInformation?.formattedSearchTime} seconds)
      </p>
      {results.items.length === 0 && (
        <p className="my-3">No results found for {keyword}</p>
      )}
      {results.items?.map((result: any) => {
        return (
          <div
            key={result.link}
            className="py-4 px-3 text-xs mb-4 border border-gray-200 rounded-lg"
          >
            <div>
              <small className=" line-clamp-1">{result.formattedUrl}</small>
              <a href={result.link} className="truncate text-xl text-blue-500">
                {result.title}
              </a>
            </div>
            <p>{result.snippet}</p>
          </div>
        );
      })}
    </div>
  );
}
