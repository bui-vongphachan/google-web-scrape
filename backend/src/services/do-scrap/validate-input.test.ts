import dotenv from "dotenv";
import validateInput from "./validate-input";

describe("validateInput", () => {
  it("should return an empty array if the input is not a string", () => {
    expect(validateInput(123)).toEqual([]);
    expect(validateInput(null)).toEqual([]);
    expect(validateInput(undefined)).toEqual([]);
    expect(validateInput({})).toEqual([]);
  });

  it("should return an empty array if the input is an empty string", () => {
    expect(validateInput("")).toEqual([]);
  });

  it("should return an empty array if the input is not an array", () => {
    expect(validateInput("|}PE@_")).toEqual([]);
    expect(validateInput("{}")).toEqual([]);
  });

  it("should return the input array if it is valid", () => {
    const input = ["item1", "item2", "item3"];
    expect(validateInput(JSON.stringify(input))).toEqual(input);
  });

  it("should return an empty array if the input array is empty", () => {
    expect(validateInput("[]")).toEqual([]);
  });
});
