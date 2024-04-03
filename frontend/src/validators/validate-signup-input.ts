import Authentication from "@/services/authentication";
import FunctionOutput from "@/services/function-output";

export default function validateSignUpInput(
  auth: Authentication
): FunctionOutput<string> {
  const output = new FunctionOutput(true, "", "");

  if (!auth.email) {
    output.message = "Please enter an email";
    return output;
  }

  if (!auth.email.toString().includes("@")) {
    output.message = "Please enter a valid email";
    return output;
  }

  if (!auth.password) {
    output.message = "Please enter a password";
    return output;
  }

  if (!auth.repassword) {
    output.message = "Please enter a password";
    return output;
  }

  if (auth.password !== auth.repassword) {
    output.message = "The password does not match";
    return output;
  }

  output.isError = false;
  output.message = "";

  return output;
}
