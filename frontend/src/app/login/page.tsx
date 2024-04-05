"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import submitLoginForm from "@/form-actions/submit-login-form";

interface FormState {
  message: string;
  isError: boolean;
  data: {
    user: {
      id: string;
      email: string;
    };
    token: string;
  } | null;
}

const initialState: FormState = {
  message: "",
  isError: false,
  data: null,
};

export default function LoginPage(props: any) {
  const { message } = props.searchParams;

  const [state, action] = useFormState(submitLoginForm, initialState);

  return (
    <main id="auth-main-box">
      <form id="form-box" action={action}>
        <h1 className=" form-title">Login</h1>
        {(state.message || message) && (
          <p className={`form-feedback ${state.isError ? "error" : "success"}`}>
            {state.message || message}
          </p>
        )}
        <label>
          <span>Email</span>
          <input
            className=" form-input"
            placeholder=""
            name="email"
            type="email"
          />
        </label>
        <label>
          <span>Password</span>
          <input className=" form-input" type="password" name="password" />
        </label>
        <div id="form-buttons-box" className=" form-buttons-box">
          <Link href="/signup" className=" btn-text-primary">
            Sign Up
          </Link>
          <button className=" btn-contained-primary">Sign In</button>
        </div>
      </form>
    </main>
  );
}
