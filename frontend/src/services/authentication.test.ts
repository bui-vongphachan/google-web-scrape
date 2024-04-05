import Authentication from "./authentication";
import validateSignUpInput from "@/validators/validate-signup-input";
import FunctionOutput from "./function-output";
import { redirect } from "next/navigation";
import User from "./user";
import locale from "@/locales/en.json";
import jwt from "jsonwebtoken";

jest.mock("@/validators/validate-signup-input");
jest.mock("@/lib/prisma");
jest.mock("next/navigation");

const rightTokenSecret = "secret";
const wrongTokenSecret = "wrong_secret";

const makeToken = (expiresIn: string) => {
  return jwt.sign({ email: "email", password: "password" }, rightTokenSecret, {
    expiresIn: expiresIn,
  });
};

describe("authentication module | validateAccessToken", () => {
  test("should redirect to login page with error message when getAccessTokenFromCookie() returns an error", async () => {
    const auth = new Authentication("email", "password");

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(
        new FunctionOutput(
          true,
          locale["authentication-get_access_token_from_cookie-no_token"],
          ""
        )
      );

    await auth.validateAccessToken();

    expect(redirect).toHaveBeenCalledWith(
      "/login?message=" +
        locale["authentication-get_access_token_from_cookie-no_token"]
    );
  });

  test("should redirect to login page with message when JWT_SECRET not set", async () => {
    process.env.JWT_SECRET = undefined;

    const auth = new Authentication("email", "password");

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(new FunctionOutput(false, "", "invalid_token"));

    await auth.validateAccessToken();

    expect(redirect).toHaveBeenCalledWith(
      "/login?message=" + locale["authentication-need_to_login"]
    );
  });

  test("should redirect to login page with message when token is invalid", async () => {
    process.env.JWT_SECRET = "something";

    const auth = new Authentication("email", "password");

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(new FunctionOutput(false, "", "invalid_token"));

    await auth.validateAccessToken();

    expect(redirect).toHaveBeenCalledWith(
      "/login?message=" + locale["authentication-need_to_login"]
    );
  });

  test("should redirect to login page with message when jwt.verify callback returns an error", async () => {
    process.env.JWT_SECRET = wrongTokenSecret;

    const auth = new Authentication("email", "password");

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(
        new FunctionOutput(false, makeToken("1d"), "valid_token")
      );

    await auth.validateAccessToken();

    expect(redirect).toHaveBeenCalledWith(
      "/login?message=" + locale["authentication-need_to_login"]
    );
  });

  test("should redirect to login page with message when token is expired", async () => {
    process.env.JWT_SECRET = rightTokenSecret;

    const auth = new Authentication("email", "password");

    const token = makeToken("1s");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(new FunctionOutput(false, "", token));

    await auth.validateAccessToken();

    expect(redirect).toHaveBeenCalledWith(
      "/login?message=" + locale["authentication-need_to_login"]
    );
  });

  test("should return valid output when token is valid", async () => {
    process.env.JWT_SECRET = rightTokenSecret;

    const auth = new Authentication("email", "password");

    const token = makeToken("10s");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    jest
      .spyOn(auth, "getAccessTokenFromCookie")
      .mockResolvedValueOnce(new FunctionOutput(false, "", token));

    const output = await auth.validateAccessToken();

    expect(output.isError).toEqual(false);
    expect(output.message).toEqual(
      locale.authentication_validate_access_token_success
    );
  });
});

describe("authentication module | login", () => {
  it("should return an error message for invalid input", async () => {
    const auth = new Authentication("", "");

    const output = await auth.login();

    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(locale["validate-sign_in-empty_email"]);
  });

  it("should return an error message for user not exists", async () => {
    // Mock valid input for login function
    (
      validateSignUpInput as jest.MockedFunction<typeof validateSignUpInput>
    ).mockReturnValueOnce(new FunctionOutput(false, "", ""));

    const auth = new Authentication("email@example.com", "password");

    // Mock findOne method to return user not found
    jest
      .spyOn(auth, "findOne")
      .mockResolvedValueOnce(
        new FunctionOutput(true, locale["user-find_one-not_found"], null)
      );

    const output = await auth.login();

    // Assert that user is not found
    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(locale["user-find_one-not_found"]);
  });

  it("should return an error message for incorrect password", async () => {
    // Mock valid input for login function
    (
      validateSignUpInput as jest.MockedFunction<typeof validateSignUpInput>
    ).mockReturnValueOnce(new FunctionOutput(false, "", ""));

    const auth = new Authentication("email@example.com", "wrong_password");

    // Mock findOne method to return existing user with correct email
    jest
      .spyOn(auth, "findOne")
      .mockResolvedValueOnce(
        new FunctionOutput(false, "", new User("email", "password"))
      );

    // Mock comparePassword method to return false since wrong password was provided
    jest
      .spyOn(auth, "comparePassword")
      .mockResolvedValueOnce(
        new FunctionOutput(
          true,
          locale["authentication-login-incorrect_password"],
          false
        )
      );

    const output = await auth.login();

    // Assert that login fails with incorrect password
    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(
      locale["authentication-login-incorrect_password"]
    );
  });

  it("should return an error message for failed to generate access token", async () => {
    // Mock valid input for login function
    (
      validateSignUpInput as jest.MockedFunction<typeof validateSignUpInput>
    ).mockReturnValueOnce(new FunctionOutput(false, "", ""));

    const auth = new Authentication("email@example.com", "password");

    // Mock findOne method to return existing user with correct email
    jest
      .spyOn(auth, "findOne")
      .mockResolvedValueOnce(
        new FunctionOutput(false, "", new User("email", "password"))
      );

    // Mock comparePassword method to return true
    jest
      .spyOn(auth, "comparePassword")
      .mockResolvedValueOnce(new FunctionOutput(false, "password", true));

    // Mock makeAccessToken method to return an error
    jest
      .spyOn(auth, "makeAccessToken")
      .mockResolvedValueOnce(
        new FunctionOutput(
          true,
          locale["authentication_make_access_token_failed"],
          ""
        )
      );

    // Excute login function
    const output = await auth.login();

    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(
      locale["authentication_make_access_token_failed"]
    );
  });

  it("should return successful login message for valid input and existing user with correct password", async () => {
    // Mock valid input for login function
    (
      validateSignUpInput as jest.MockedFunction<typeof validateSignUpInput>
    ).mockReturnValueOnce(new FunctionOutput(false, "", ""));

    const auth = new Authentication("email@example.com", "password");

    // Mock findOne method to return existing user with correct email
    jest
      .spyOn(auth, "findOne")
      .mockResolvedValueOnce(
        new FunctionOutput(false, "", new User("email", "password"))
      );

    // Mock comparePassword method to return true
    jest
      .spyOn(auth, "comparePassword")
      .mockResolvedValueOnce(new FunctionOutput(false, "password", true));

    // Mock makeAccessToken method to return success
    jest
      .spyOn(auth, "makeAccessToken")
      .mockResolvedValueOnce(
        new FunctionOutput(false, "Failed to generate token", "token")
      );

    // Mock setCookie method to return success
    jest.spyOn(auth, "setCookie").mockResolvedValueOnce();

    // Excute login function
    const output = await auth.login();

    expect(output.message).toEqual(locale["authentication-login_success"]);
    expect(output.isError).toEqual(false);
  });
});
