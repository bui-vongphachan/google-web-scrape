"use client";

import saveResultInClient from "@/lib/saveResultInClient";
import React from "react";

interface ResultSaverProps {
  searchResult: Map<string, string>;
}

export default function ResultSaver(props: ResultSaverProps) {
  React.useEffect(() => {
    props.searchResult.forEach((value, key) => {
      saveResultInClient(value, key);
    });
  }, [props.searchResult]);

  return <div></div>;
}
