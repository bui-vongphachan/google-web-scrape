import Authentication from "@/services/authentication";
import FunctionOutput from "@/services/function-output";
import locale from "@/locales/en.json";

export default function validateSignInInput(
  auth: Authentication
): FunctionOutput<string> {
  const output = new FunctionOutput(true, "", "");

  if (!auth.email) {
    output.message = locale["validate-sign_in-empty_email"];
    return output;
  }

  if (!auth.email.toString().includes("@")) {
    output.message = locale["validate-sign_in-invalid_email"];
    return output;
  }

  if (!auth.password) {
    output.message = locale["validate-sign_in-empty_password"];
    return output;
  }

  output.isError = false;
  output.message = locale["validate-sign_in-success"];

  return output;
}
