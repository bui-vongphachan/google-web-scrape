import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function validateAccessToken() {
  const cookie = cookies();

  const fallbackPath = "/login?message=Please login to continue";

  if (!cookie.has("token")) return redirect(fallbackPath);

  const token = cookie.get("token")?.value;

  if (!token) return redirect(fallbackPath);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!payload) return redirect(fallbackPath);

    return payload as {
      id: string;
      email: string;
    };
  } catch (error) {
    console.log(error);
    return redirect(fallbackPath);
  }
}
