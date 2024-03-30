"use client";

import submitFile from "@/lib/submitFile";
import React from "react";
import { useFormState } from "react-dom";
import ResultSaver from "./ResultSaver";
import { GoogleSearchInfo, GoogleSearchItems } from "@prisma/client";

const initialState: {
  message: string;
  data: {
    searchInformation: GoogleSearchInfo;
    items?: GoogleSearchItems[];
  }[];
} = {
  message: "",
  data: [],
};

export default function FileInput() {
  const ref = React.useRef<HTMLButtonElement>(null);

  const [state, action] = useFormState(submitFile, initialState);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div id="upload-input" className="upload-input-container">
      <ResultSaver searchResult={state.data!} />
      <form action={action} className="upload-form">
        <div className="upload-box">
          <label htmlFor="file-upload" className="upload-label ">
            <span>Choose a file</span>
            <input
              id="file-upload"
              type="file"
              name="file"
              accept=".csv"
              onChange={onChange}
              className="sr-only"
            />
          </label>
        </div>
        <button type="submit" className=" hidden" ref={ref}>
          submit
        </button>
        <p>{state.message}</p>
      </form>
    </div>
  );
}
