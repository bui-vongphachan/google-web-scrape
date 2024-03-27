"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import headers, { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export default async function login(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  prevState.message = "";
  prevState.isError = false;
  prevState.data = null;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) {
    return {
      message: "Please enter an email",
      isError: true,
      data: null,
    };
  }

  if (!email.toString().includes("@")) {
    return {
      message: "Please enter a valid email",
      isError: true,
      data: null,
    };
  }

  if (!password) {
    return {
      message: "Please enter a password",
      isError: true,
      data: null,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!existingUser) {
    return {
      message: "Incorrect email or password",
      isError: true,
      data: null,
    };
  }

  const validPassword = await bcrypt.compare(
    password,
    existingUser.password || ""
  );

  if (!validPassword) {
    return {
      message: "Incorrect email or password",
      isError: true,
      data: null,
    };
  }

  const tokenSecret = process.env.NEXTAUTH_SECRET;

  if (!tokenSecret) {
    return {
      message: "Incorrect email or password",
      isError: true,
      data: null,
    };
  }

  const token = jwt.sign(
    {
      email: existingUser.email,
      id: existingUser.id,
    },
    tokenSecret
  );

  const cookie = cookies();

  cookie.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  cookie.set("email", email, {
    httpOnly: true,
    path: "/",
  });

  cookie.set("id", existingUser.id, {
    httpOnly: true,
    path: "/",
  });

  redirect("/");
}
