import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import validateSignUpInput from "@/validators/validate-signup-input";
import User from "./user";
import FunctionOutput from "./function-output";

export default class Authentication extends User {
  repassword = "";
  token = "";

  constructor(email: string, password: string, repassword?: string) {
    super(email, password);

    this.repassword = repassword || "";
  }

  async validateAccessToken() {
    const validateOutput = new FunctionOutput(true, "", "");

    const getTokenOutput = await this.getAccessTokenFromCookie();

    if (getTokenOutput.isError)
      return redirect("/login?message=" + getTokenOutput.message);

    try {
      await new Promise((resolve) => {
        jwt.verify(
          getTokenOutput.data,
          process.env.JWT_SECRET as string,
          (err) => {
            if (err)
              return redirect("/login?message=" + "Please login to continue");
          }
        );

        resolve(null);
      });
    } catch (error) {
      console.log(error);
      return redirect("/login?message=" + "Please login to continue");
    }

    validateOutput.isError = false;
    validateOutput.message = "Token is valid";

    return validateOutput;
  }

  async login() {
    const output = new FunctionOutput(true, "", "");

    const validationOutput = validateSignUpInput(this);

    if (validationOutput.isError) validationOutput;

    const existingUser = await this.findOne();

    if (existingUser.isError || existingUser.data === null) return output;

    const compareResult = await this.comparePassword(
      existingUser.data.password as string
    );

    if (compareResult.isError || !compareResult.data) return compareResult;

    const makeTokenOutput = await this.makeAccessToken();

    if (makeTokenOutput.isError) return makeTokenOutput;

    this.setCookie();

    output.isError = false;
    output.message = "Login successful";

    return output;
  }

  async signup() {
    const signUpOutput = new FunctionOutput(true, "", "");

    const validationOutput = validateSignUpInput(this);

    if (validationOutput.isError) return validationOutput;

    const findDuplicateOutput = await this.findDuplicate();

    if (findDuplicateOutput.isError) return findDuplicateOutput;

    const hashedPasswordOutput = await this.hashPassword();

    if (hashedPasswordOutput.isError) return hashedPasswordOutput;

    const savedUserOutput = await this.save(hashedPasswordOutput.data);

    if (savedUserOutput.isError) return savedUserOutput;

    signUpOutput.isError = false;
    signUpOutput.message = "User created successfully";

    return signUpOutput;
  }

  async makeAccessToken() {
    const output = new FunctionOutput(true, "", "");

    const token = jwt.sign(
      { email: this.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    if (!token) {
      output.message = "Failed to generate token";
      return output;
    }

    output.data = token;
    output.isError = false;

    return output;
  }

  async setCookie() {
    const cookie = cookies();

    cookie.set("token", this.token, {
      httpOnly: true,
      path: "/",
    });

    cookie.set("email", this.email, {
      httpOnly: true,
      path: "/",
    });

    cookie.set("id", this.id, {
      httpOnly: true,
      path: "/",
    });
  }

  async getAccessTokenFromCookie() {
    const output = new FunctionOutput(true, "", "");

    const cookie = cookies();

    if (!cookie.has("token")) {
      output.message = "Token not found";
      return output;
    }

    const token = cookie.get("token")?.value;

    if (!token) {
      output.message = "Token not found";
      return output;
    }

    output.data = token;
    output.isError = false;

    return output;
  }
}
