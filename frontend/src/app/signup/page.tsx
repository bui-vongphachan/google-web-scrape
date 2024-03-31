"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import signup from "./action";

const initialState: {
  message: string;
  isError: boolean;
} = {
  message: "",
  isError: false,
};

export default function SignUpPage() {
  const [state, action] = useFormState(signup, initialState);

  return (
    <main id="auth-main-box">
      <form id="form-box" action={action}>
        <h1 className=" form-title">Sign up</h1>
        {state.message && (
          <p className={`form-feedback ${state.isError ? "error" : "success"}`}>
            {state.message}
          </p>
        )}
        <label>
          <span>Email</span>
          <input
            className=" form-input"
            placeholder=""
            name="email"
            type="email"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            required
            className=" form-input"
            type="password"
            name="password"
          />
        </label>
        <label>
          <span>Re-Password</span>
          <input
            required
            className=" form-input"
            type="password"
            name="repassword"
          />
        </label>
        <div id="form-buttons-box" className=" form-buttons-box">
          <Link href="/login" className=" btn-text-primary">
            Back to Login
          </Link>
          <button className=" btn-contained-primary">Confirm</button>
        </div>
      </form>
    </main>
  );
}
