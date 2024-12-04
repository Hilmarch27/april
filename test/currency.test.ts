import { describe, it, expect } from "bun:test";
import { Currency} from "../src/utils/currency";

describe("toRupiah", () => {
  it("should format a number as Rupiah currency", () => {
    expect(Currency.rupiah(1234567)).toBe("Rp 1.234.567");
  });

  it("should format a string number as Rupiah currency", () => {
    expect(Currency.rupiah("9876543")).toBe("Rp 9.876.543");
  });

  it("should handle numbers with decimal values", () => {
    expect(Currency.rupiah(12345.67)).toBe("Rp 12.345,67");
  });

  it("should handle string numbers with commas", () => {
    expect(Currency.rupiah("12345,67")).toBe("Rp 12.345,67");
  });

  it("should return 'Rp 0' for undefined or null input", () => {
    expect(Currency.rupiah(undefined as unknown as number)).toBe("Rp 0");
    expect(Currency.rupiah(null as unknown as number)).toBe("Rp 0");
  });

  it("should remove non-numeric characters before formatting", () => {
    expect(Currency.rupiah("1_23a456.78")).toBe("Rp 123.456,78");
  });
});

describe("fromRupiah", () => {
  it("should convert a simple Rupiah string to a number", () => {
    const result = Currency.deserialize("Rp 1.000");
    expect(result).toBe(1000);
  });

  it("should handle Rupiah strings with decimals", () => {
    const result = Currency.deserialize("Rp 1.000,50");
    expect(result).toBe(1000.5);
  });

  it("should handle strings without the 'Rp' prefix", () => {
    const result = Currency.deserialize("1.000");
    expect(result).toBe(1000);
  });

  it("should return 0 for 'Rp 0'", () => {
    const result = Currency.deserialize("Rp 0");
    expect(result).toBe(0);
  });

  it("should return 0 for empty strings", () => {
    const result = Currency.deserialize("");
    expect(result).toBe(0);
  });

  it("should return 0 for null input", () => {
    const result = Currency.deserialize(null as unknown as string);
    expect(result).toBe(0);
  });

  it("should return 0 for undefined input", () => {
    const result = Currency.deserialize(undefined as unknown as string);
    expect(result).toBe(0);
  });

  it("should return 0 for invalid currency strings", () => {
    const result = Currency.deserialize("invalid-string");
    expect(result).toBe(0);
  });

  it("should handle large numbers", () => {
    const result = Currency.deserialize("Rp 1.000.000.000,75");
    expect(result).toBe(1000000000.75);
  });

  it("should handle strings with only spaces", () => {
    const result = Currency.deserialize("   ");
    expect(result).toBe(0);
  });
});
