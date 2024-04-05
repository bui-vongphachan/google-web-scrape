import User from "./user";
import prisma from "@/lib/prisma";
import locale from "@/locales";

describe("user module | findOne", () => {
  it("should return error when user is not found", async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue(null);

    const user = new User("example@email.com", "password");

    const output = await user.findOne();

    expect(output.message).toEqual("User not found");
    expect(output.isError).toEqual(true);
  });

  it("should return error when prisma throws an error", async () => {
    prisma.user.findFirst = jest
      .fn()
      .mockRejectedValueOnce(new Error("Mocked error"));

    const user = new User("example@email.com", "password");

    const output = await user.findOne();

    expect(output.message).toEqual(locale.en.user_find_one_not_found);
    expect(output.isError).toEqual(true);
  });

  it("should return success", async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValueOnce({
      email: "email@email.com",
      password: "password",
    });

    const user = new User("email@email.com", "password");

    const output = await user.findOne();

    expect(output.message).toEqual(locale.en.user_find_one_found);
    expect(output.isError).toEqual(false);
  });
});

describe("user module | findDuplicate", () => {
  it("should return error if user already exists", async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValueOnce({
      email: "example@email.com",
      password: "password",
    });

    const user = new User("example@email.com", "password");

    const output = await user.findDuplicate();

    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(locale.en.user_find_duplicate_found);
  });

  it("should return error if prisma throws an error ", async () => {
    prisma.user.findFirst = jest
      .fn()
      .mockRejectedValueOnce(new Error("Mocked error"));

    const user = new User("example@email.com", "password");

    const output = await user.findDuplicate();

    expect(output.isError).toEqual(true);
    expect(output.message).toEqual(locale.en.user_find_duplicate_found);
  });

  it("should return success if no user with the same email exists", async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValueOnce(null);

    const user = new User("example@email.com", "password");

    const output = await user.findDuplicate();

    expect(output.isError).toEqual(false);
    expect(output.message).toEqual(locale.en.user_find_duplicate_not_found);
  });
});

describe("user module | hashPassword", () => {
  it("should ", async () => {});
});

describe("user module | save", () => {
  it("should ", async () => {});
});

describe("user module | comparePassword", () => {
  it("should ", async () => {});
});
