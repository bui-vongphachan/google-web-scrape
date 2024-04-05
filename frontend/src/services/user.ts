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

    console.log(`Searching for user with email: ${this.email}`);
    const existingUser = await prisma.user
      .findFirst({
        where: {
          email: this.email,
        },
      })
      .then((user) => {
        console.log(`User found in database: ${user ? user.email : "none"}`);
        return user;
      })
      .catch((err) => {
        console.log(`Error finding user in database: ${err}`);
        return null;
      });

    if (!existingUser) {
      console.log("User not found in database");
      output.message = locale.en.user_find_one_not_found;
      return output;
    }

    console.log("User found, returning data");
    output.data = existingUser as unknown as User;
    output.isError = false;
    output.message = locale.en["user_find_one_found"];

    return output;
  }

  async findDuplicate(): Promise<FunctionOutput<string>> {
    const output = new FunctionOutput<string>(false, "", "");

    const existingUser = await prisma.user.findFirst({
      where: {
        email: this.email,
      },
    });

    if (existingUser) {
      output.isError = true;
      output.message = "User already exists";
      return output;
    }

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
      output.message = locale.en["authentication-login-incorrect_password"];
      return output;
    }

    output.data = true;
    output.isError = false;
    return output;
  }
}
