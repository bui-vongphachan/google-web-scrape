"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export default async function signup(
  prevState: any,
  formData: FormData
): Promise<{ message: string; isError: boolean }> {
  prevState.message = "";
  prevState.isError = false;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repassword = formData.get("repassword") as string;

  if (!email) {
    return {
      message: "Please enter an email",
      isError: true,
    };
  }

  if (!email.toString().includes("@")) {
    return {
      message: "Please enter a valid email",
      isError: true,
    };
  }

  if (!password) {
    return {
      message: "Please enter a password",
      isError: true,
    };
  }

  if (!repassword) {
    return {
      message: "Please enter a password",
      isError: true,
    };
  }

  if (password !== repassword) {
    return {
      message: "The password does not match",
      isError: true,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return {
      message: "User already exists",
      isError: true,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  const message = "User created successfully";

  redirect("/login?message=" + message);
}
