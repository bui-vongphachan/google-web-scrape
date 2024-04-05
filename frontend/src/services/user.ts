import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import FunctionOutput from "./function-output";
import locale from "@/locales";

export default class User {
  id = "";
  email: string = "";
  password: string = "";

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async findOne(): Promise<FunctionOutput<User | null>> {
    const output = new FunctionOutput<User | null>(true, "", null);

    process.env.DEBUG &&
      console.log(`Searching for user with email: ${this.email}`);

    const existingUser = await prisma.user
      .findFirst({
        where: {
          email: this.email,
        },
      })
      .then((user) => {
        process.env.DEBUG && console.log(`User found in database: ${user}`);
        return user;
      })
      .catch((err) => {
        process.env.DEBUG &&
          console.log(`Error finding user in database: ${err}`);
        return null;
      });

    if (process.env.DEBUG) {
      console.log(`User found in database: ${existingUser?.email}`);
    }

    if (!existingUser) {
      process.env.DEBUG && console.log("User not found in database");
      output.message = locale.en.user_find_one_not_found;
      return output;
    }

    process.env.DEBUG && console.log("User found, returning data");
    output.data = existingUser as unknown as User;
    output.isError = false;
    output.message = locale.en["user_find_one_found"];

    return output;
  }

  async findDuplicate(): Promise<FunctionOutput<string>> {
    const output = new FunctionOutput<string>(false, "", "");

    process.env.DEBUG &&
      console.log(`Checking if user with email ${this.email} already exists`);

    const queryOutput = await prisma.user
      .findFirst({
        where: {
          email: this.email,
        },
      })
      .then((user) => {
        if (process.env.DEBUG) {
          console.log(`User found in database: ${user ? user.email : "none"}`);
        }

        const message = locale.en.user_find_one_found;

        const output = new FunctionOutput<User | null>(
          false,
          message,
          user as unknown as User
        );

        return output;
      })
      .catch((err) => {
        if (process.env.DEBUG) {
          console.log(`Error finding user in database: ${err}`);
        }

        const message = locale.en.user_find_one_not_found;

        const output = new FunctionOutput<User | null>(true, message, null);

        return output;
      });

    if (queryOutput.isError) {
      process.env.DEBUG && console.log("User already exists");
      output.isError = true;
      output.message = locale.en.user_find_duplicate_found;
      return output;
    }

    if (queryOutput.data) {
      process.env.DEBUG && console.log("User already exists");
      output.isError = true;
      output.message = locale.en.user_find_duplicate_found;
      return output;
    }

    process.env.DEBUG && console.log("User does not already exist");

    output.message = locale.en.user_find_duplicate_not_found;
    output.isError = false;

    return output;
  }

  async hashPassword(): Promise<FunctionOutput<string>> {
    const output = new FunctionOutput<string>(false, "", "");

    if (!this.password) {
      output.isError = true;
      output.message = "Please enter a password";
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    if (!hashedPassword) {
      output.isError = true;
      output.message = "Failed to hash password";
    }

    output.data = hashedPassword;

    return output;
  }

  async save(hashedPassword: string): Promise<FunctionOutput<string>> {
    const output = new FunctionOutput<string>(false, "", "");

    await prisma.user.create({
      data: {
        email: this.email,
        password: hashedPassword,
      },
    });

    output.data = "User created successfully";

    return output;
  }

  async comparePassword(password: string): Promise<FunctionOutput<boolean>> {
    const output = new FunctionOutput<boolean>(true, "", false);

    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
      output.message = locale.en.authentication_login_incorrect_password;
      return output;
    }

    output.data = true;
    output.isError = false;
    return output;
  }
}
