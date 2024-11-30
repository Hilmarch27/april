import { describe, it, expect } from "vitest";
import { toCapitalize } from "../src/utils/text";

describe("toCapitalize function", () => {
  it("should capitalize the first letter of each word", () => {
    const result = toCapitalize("hello world");
    expect(result).toBe("Hello World");
  });

  it("should return undefined for falsy input (null)", () => {
    const result = toCapitalize(null as any);
    expect(result).toBeUndefined();
  });

  it("should return undefined for falsy input (undefined)", () => {
    const result = toCapitalize(undefined);
    expect(result).toBeUndefined();
  });

  it("should return undefined for an empty string", () => {
    const result = toCapitalize("");
    expect(result).toBeUndefined();
  });

  it("should return the same string when the input is already capitalized", () => {
    const result = toCapitalize("Hello World");
    expect(result).toBe("Hello World");
  });

  it("should handle a string with multiple words correctly", () => {
    const result = toCapitalize("this is a test sentence");
    expect(result).toBe("This Is A Test Sentence");
  });

  it("should handle a single word", () => {
    const result = toCapitalize("hello");
    expect(result).toBe("Hello");
  });

  it("should return undefined for falsy input (0)", () => {
    const result = toCapitalize(0 as any);
    expect(result).toBeUndefined();
  });

  it("should handle mixed case input correctly", () => {
    const result = toCapitalize("heLLo WoRLD");
    expect(result).toBe("Hello World");
  });
});
