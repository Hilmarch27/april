import {
  format,
  parseISO,
  isDate,
  differenceInDays,
  addDays,
  subDays,
  isEqual,
  isAfter,
  isBefore,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id as idLocale } from "date-fns/locale";

export class Moment {
  /**
   * Formats a date to 'dd-MMMM-yyyy' in Indonesian locale.
   * @param {Date|string} date - The date to format.
   * @returns {string|null|undefined} - Formatted date or null/undefined if input is null/undefined.
   */
  static formatDateId(date: Date | string): string | null | undefined {
    if (date == null) {
      return date; // Return null/undefined as-is.
    }

    // Parse ISO string to Date object if input is a string.
    if (typeof date === "string") {
      date = parseISO(date);
    }

    // Validate the date.
    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided: ${date}`);
    }

    return format(date, "dd-MMMM-yyyy", { locale: idLocale });
  }

  /**
   * Calculates the age based on a given birthdate.
   * @param {string|Date} birthDate - The birthdate to calculate age from.
   * @returns {number} - The calculated age.
   */
  static birthDate(birthDate: string | Date): number {
    const today = new Date();
    const birth =
      typeof birthDate === "string" ? parseISO(birthDate) : birthDate;

    if (!isDate(birth) || isNaN(birth.getTime())) {
      throw new Error(`Invalid birthDate: ${birthDate}`);
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Formats a date to 'yyyy-MM-dd HH:mm:ss'.
   * @param {Date|string} date - The date to format.
   * @returns {string|null|undefined} - Formatted datetime string.
   */
  static formatDateTime(date: Date | string): string | null | undefined {
    if (date == null) return date;

    if (typeof date === "string") {
      date = parseISO(date);
    }

    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided: ${date}`);
    }

    return format(date, "yyyy-MM-dd HH:mm:ss");
  }

  /**
   * Calculates the difference in days between two dates.
   * @param {Date|string} startDate - The start date.
   * @param {Date|string} endDate - The end date.
   * @returns {number} - The difference in days.
   */
  static differenceInDays(
    startDate: Date | string,
    endDate: Date | string
  ): number {
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

    if (
      !isDate(start) ||
      isNaN(start.getTime()) ||
      !isDate(end) ||
      isNaN(end.getTime())
    ) {
      throw new Error("Invalid dates provided");
    }

    return differenceInDays(end, start);
  }

  /**
   * Adds a specific number of days to a date.
   * @param {Date|string} date - The initial date.
   * @param {number} days - Number of days to add.
   * @returns {Date} - The new date with days added.
   */
  static addDays(date: Date | string, days: number): Date {
    if (typeof date === "string") {
      date = parseISO(date);
    }

    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error("Invalid date provided");
    }

    return addDays(date, days);
  }

  /**
   * Subtracts a specific number of days from a date.
   * @param {Date|string} date - The initial date.
   * @param {number} days - Number of days to subtract.
   * @returns {Date} - The new date with days subtracted.
   */
  static subtractDays(date: Date | string, days: number): Date {
    if (typeof date === "string") {
      date = parseISO(date);
    }

    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error("Invalid date provided");
    }

    return subDays(date, days);
  }

  /**
   * Formats a date to 'HH:mm:ss' (time only).
   * @param {Date|string} date - The date to format.
   * @returns {string|null|undefined} - Formatted time string.
   */
  static formatTime(date: Date | string): string | null | undefined {
    if (date == null) return date;

    if (typeof date === "string") {
      date = parseISO(date);
    }

    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided: ${date}`);
    }

    return format(date, "HH:mm:ss");
  }

  /**
   * Converts a date to UTC ISO format (e.g., 'yyyy-MM-ddTHH:mm:ss.SSSZ').
   * @param {Date|string} date - The date to convert.
   * @returns {string|null|undefined} - The UTC ISO formatted string.
   */
  static toUTC(date: Date | string): string | null | undefined {
    if (date == null) return date;

    if (typeof date === "string") {
      date = parseISO(date);
    }

    if (!isDate(date) || isNaN(date.getTime())) {
      throw new Error(`Invalid date provided: ${date}`);
    }

    return date.toISOString();
  }

  /**
   * Checks if the current date (or a specific date and time) is within the period defined by startDate and endDate.
   * @param {Date|string} startDate - The start date and time of the period.
   * @param {Date|string} endDate - The end date and time of the period.
   * @param {Date|string} [currentDate=new Date()] - The date and time to check (default: now).
   * @param {string} [timeZone="Asia/Jakarta"] - The timezone to use for the comparison.
   * @returns {boolean} - True if the current date and time is within the period; otherwise, false.
   */
  static period(
    startDate: Date | string,
    endDate: Date | string,
    currentDate: Date | string = new Date(),
    timeZone: string = "Asia/Jakarta" // Zona waktu default untuk Jakarta (WIB)
  ): boolean {
    // Convert string inputs to Date objects.
    if (typeof startDate === "string") startDate = parseISO(startDate);
    if (typeof endDate === "string") endDate = parseISO(endDate);
    if (typeof currentDate === "string") currentDate = parseISO(currentDate);

    // Validate dates.
    if (!isDate(startDate) || isNaN(startDate.getTime())) {
      throw new Error(`Invalid startDate provided: ${startDate}`);
    }
    if (!isDate(endDate) || isNaN(endDate.getTime())) {
      throw new Error(`Invalid endDate provided: ${endDate}`);
    }
    if (!isDate(currentDate) || isNaN(currentDate.getTime())) {
      throw new Error(`Invalid currentDate provided: ${currentDate}`);
    }

    // Convert all dates to the specified timezone
    const startDateInZone = toZonedTime(startDate, timeZone);
    const endDateInZone = toZonedTime(endDate, timeZone);
    const currentDateInZone = toZonedTime(currentDate, timeZone);

    // Log for debugging
    console.log("Start Date in Zone: ", startDateInZone);
    console.log("End Date in Zone: ", endDateInZone);
    console.log("Current Date in Zone: ", currentDateInZone);

    // Check if currentDate is within the range [startDate, endDate].
    return (
      (isEqual(currentDateInZone, startDateInZone) ||
        isAfter(currentDateInZone, startDateInZone)) &&
      (isEqual(currentDateInZone, endDateInZone) ||
        isBefore(currentDateInZone, endDateInZone))
    );
  }
}
