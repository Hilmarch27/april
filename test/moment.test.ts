import { describe, it, expect } from "vitest";
import { Moment } from "../src/utils/moment"; // Gantilah dengan import yang sesuai

describe("Moment.period", () => {
  it("should return true if current date is within the period", () => {
    const startDate = "2024-11-30T05:00:00.000Z";
    const endDate = "2024-12-02T08:00:00.000Z";
    const currentDate = "2024-11-30T10:00:00.000Z";
    const timeZone = "Asia/Jakarta";

    const result = Moment.period(startDate, endDate, currentDate, timeZone);
    expect(result).toBe(true);
  });

  it("should return false if current date is before the period", () => {
    const startDate = "2024-11-30T05:00:00.000Z";
    const endDate = "2024-12-02T08:00:00.000Z";
    const currentDate = "2024-11-30T03:00:00.000Z";
    const timeZone = "Asia/Jakarta";

    const result = Moment.period(startDate, endDate, currentDate, timeZone);
    expect(result).toBe(false);
  });

  it("should return false if current date is after the period", () => {
    const startDate = "2024-11-30T05:00:00.000Z";
    const endDate = "2024-12-02T08:00:00.000Z";
    const currentDate = "2024-12-03T10:00:00.000Z";
    const timeZone = "Asia/Jakarta";

    const result = Moment.period(startDate, endDate, currentDate, timeZone);
    expect(result).toBe(false);
  });

  it("should handle edge cases", () => {
    const startDate = "2024-11-30T05:00:00.000Z";
    const endDate = "2024-12-02T08:00:00.000Z";
    const currentDate = "2024-11-30T05:00:00.000Z";
    const timeZone = "Asia/Jakarta";

    const result = Moment.period(startDate, endDate, currentDate, timeZone);
    expect(result).toBe(true); // Start date matches the current date, so true
  });
});
