"use server";

import Authentication from "@/services/authentication";
import validateSignInInput from "@/validators/validate-signin-input";
import { redirect } from "next/navigation";

interface FormState {
  message: string;
  isError: boolean;
}

export default async function submitLoginForm(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  prevState.message = "";
  prevState.isError = false;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const auth = new Authentication(email, password);

  const validation = validateSignInInput(auth);

  if (validation.isError) return validation;

  const loginOutput = await auth.login();

  if (loginOutput.isError) return loginOutput;

  return redirect("/");
}
