"use client";

import submitFile from "@/lib/submitFile";
import React from "react";
import { useFormState } from "react-dom";
import ResultSaver from "./ResultSaver";

const initialState = {
  message: "",
  data: new Map<string, string>(),
};

export default function FileInput() {
  const ref = React.useRef<HTMLButtonElement>(null);

  const [state, action] = useFormState(submitFile, initialState);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div id="search-box" className=" flex-1 ">
      <ResultSaver searchResult={state.data!} />
      <form action={action}>
        <input type="file" name="file" accept=".csv" onChange={onChange} />
        <button type="submit" className=" hidden" ref={ref}>
          submit
        </button>
        <p>{state.message}</p>
      </form>
    </div>
  );
}
