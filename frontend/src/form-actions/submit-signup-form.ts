"use server";

import Authentication from "@/services/authentication";
import { redirect } from "next/navigation";

export default async function submitSignUpForm(
  prevState: any,
  formData: FormData
): Promise<{ message: string; isError: boolean }> {
  prevState.message = "";
  prevState.isError = false;

  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const repassword = (formData.get("repassword") as string) || "";

  const auth = new Authentication(email, password, repassword);

  const signupOutput = await auth.signup();

  if (signupOutput.isError) return signupOutput;

  redirect("/login?message=" + signupOutput.message);
}
