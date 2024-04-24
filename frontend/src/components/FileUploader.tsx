"use client";

import submitFileUpload from "@/form-actions/submit-file-upload";
import FunctionOutput from "@/services/function-output";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useFormState } from "react-dom";

const initialState: FunctionOutput<any> = {
  message: "",
  isError: false,
  data: null,
};

export default function FileUploader() {
  const ref = React.useRef<HTMLButtonElement>(null);

  const searchParams = useSearchParams();

  const [_, action] = useFormState(submitFileUpload, initialState);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
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
  );
}
