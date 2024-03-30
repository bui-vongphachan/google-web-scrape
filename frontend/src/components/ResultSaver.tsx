"use client";

import saveResultInClient from "@/lib/saveResultInClient";
import { GoogleSearchInfo, GoogleSearchItems } from "@prisma/client";
import React from "react";

interface ResultSaverProps {
  searchResult: {
    searchInformation: GoogleSearchInfo;
    items?: GoogleSearchItems[];
  }[];
}

export default function ResultSaver(props: ResultSaverProps) {
  React.useEffect(() => {
    props.searchResult.forEach((value, key) => {
      console.log(`Saving result for key ${key}`);

      console.log(value);
      // saveResultInClient(value, key);
    });
  }, [props.searchResult]);

  return <div></div>;
}
