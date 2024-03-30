"use client";

import submitFile, { ActionResult } from "./action";
import React from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import saveResultInClient from "./saveResultInClient";

const initialState: ActionResult = {
  message: "",
  data: [],
};

export default function Appbar() {
  const ref = React.useRef<HTMLButtonElement>(null);

  const { pending } = useFormStatus();

  const [state, action] = useFormState(submitFile, initialState);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.click();
  };

  React.useEffect(() => {
    const cloneState = state as ActionResult;

    if (!cloneState.data) return;

    if (cloneState.data.length === 0) return;

    saveResultInClient(cloneState.data);
  }, [state]);

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
          <p>{state.message}</p>
        </form>
      </div>
      <div id="sample-box">
        <a href="/sample-keyword.csv" download="sample-keyword.csv">
          Click to Download
        </a>
      </div>
    </div>
  );
}
