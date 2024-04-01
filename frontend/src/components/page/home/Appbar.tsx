"use client";

import { useSearchParams } from "next/navigation";
import submitFile, { ActionResult } from "@/app/action";
import React from "react";
import { useFormState } from "react-dom";

const initialState: ActionResult = {
  message: "",
  data: [],
};

export default function Appbar() {
  const searchParams = useSearchParams();

  const ref = React.useRef<HTMLButtonElement>(null);

  const [state, action] = useFormState(submitFile, initialState);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div id="actions-box" className="action-box">
      <div id="upload-box">
        <form action={action}>
          <div className="upload-input">
            <label htmlFor="file-upload">
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
          <p>{searchParams.get("message")}</p>
        </form>
      </div>
      <div id="sample-box">
        <a href="/sample-keyword.csv" download="sample-keyword.csv">
          Sample file
        </a>
      </div>
    </div>
  );
}
