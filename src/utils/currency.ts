export class Currency {
  /**
   * Converts a given number to a string in Rupiah currency format.
   * The number may contain non-numeric characters like comma, dot, or underscore.
   * @param {number|string} number The number to convert
   * @returns {string} The number formatted as Rupiah currency string
   */
  static rupiah(number: number | string): string {
    if (number === undefined || number === null) {
      return "Rp 0";
    }

    // Remove all non-numeric characters except for comma and dot
    const stringNumber = number.toString().replace(/[^\d.,]/g, "");

    // Replace comma with dot if multiple dots exist
    const normalizedNumber = stringNumber.replace(/,/g, ".");

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = normalizedNumber.split(".");

    // Format integer part with dot separators
    const formattedInteger = integerPart
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      .replace(/^0+/, ""); // Remove leading zeros

    // Combine with decimal part if exists
    const rupiah = decimalPart
      ? `${formattedInteger},${decimalPart.slice(0, 2).padEnd(2, "0")}`
      : formattedInteger;

    return `Rp ${rupiah || "0"}`;
  }

  /**
   * Deserializes a currency string into a numeric value.
   * Supports currency strings with or without currency symbols, commas, and dots.
   * Converts thousands separators (dots) to be removed and decimal commas to dots.
   * @param {string} currency The currency string to deserialize
   * @returns {number} The numeric value, or 0 if the input is invalid or represents zero
   */
  static deserialize(currency: string): number {
    if (!currency || currency.trim() === "0" || currency.trim() === "") {
      return 0;
    }

    // Remove any currency symbol (e.g., Rp, $, €, etc.) and whitespace
    const cleanedCurrency = currency.replace(/^[^\d]+/, "").trim();

    // Remove dot separators for thousands
    const withoutDots = cleanedCurrency.replace(/\./g, "");

    // Replace comma with dot for decimals
    const normalizedNumber = withoutDots.replace(",", ".");

    // Convert to number
    const result = parseFloat(normalizedNumber);

    // Return 0 if result is NaN
    return isNaN(result) ? 0 : result;
  }

  /**
   * Formats a number to include thousand separators with dots (.) and two decimal points.
   * @param {number|string} number The number to format
   * @param {string} currencySymbol The currency symbol to prepend (default: "Rp")
   * @returns {string} The formatted number with thousand separators
   */
  static format(number: number | string, currencySymbol = "Rp"): string {
    if (number === undefined || number === null) {
      return `${currencySymbol} 0`;
    }

    const parsedNumber = parseFloat(number.toString().replace(/[^\d.-]/g, ""));
    if (isNaN(parsedNumber)) return `${currencySymbol} 0`;

    const formattedNumber = parsedNumber
      .toFixed(2) // Ensure two decimal points
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // Add thousand separators
      .replace(".", ","); // Use comma for decimal separator

    return `${currencySymbol} ${formattedNumber}`;
  }

  /**
   * Rounds a number to the nearest integer or to a specified number of decimal places.
   * @param {number|string} number The number to round
   * @param {number} decimalPlaces The number of decimal places (default: 2)
   * @returns {number} The rounded number
   */
  static round(number: number | string, decimalPlaces = 2): number {
    if (number === undefined || number === null) {
      return 0;
    }

    const parsedNumber = parseFloat(number.toString());
    if (isNaN(parsedNumber)) return 0;

    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(parsedNumber * multiplier) / multiplier;
  }

  /**
   * Converts a numeric value to words (e.g., "1000" becomes "Seribu Rupiah").
   * Supports only Indonesian Rupiah conversion.
   * @param {number|string} number The numeric value
   * @returns {string} The number in words (Indonesian)
   */
  static toWords(number: number | string): string {
    if (number === undefined || number === null) {
      return "Nol Rupiah";
    }

    const words = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
    ];
    const units = ["", "Ribu", "Juta", "Miliar", "Triliun"];
    const numString = number.toString().replace(/[^\d]/g, "");
    if (isNaN(Number(numString)) || numString.length === 0) return "Nol Rupiah";

    let wordResult = "";
    let numberGroup = numString
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g) as RegExpMatchArray | null;
    if (!numberGroup) return "Nol Rupiah";

    numberGroup!.map((group) => group.split("").reverse().join(""));
    numberGroup.forEach((group, i) => {
      const groupNumber = parseInt(group, 10);
      if (groupNumber > 0) {
        const hundreds = Math.floor(groupNumber / 100);
        const tens = Math.floor((groupNumber % 100) / 10);
        const unitsPlace = groupNumber % 10;

        if (hundreds > 0) {
          wordResult +=
            hundreds === 1 ? "Seratus " : `${words[hundreds]} Ratus `;
        }
        if (tens > 1) {
          wordResult += `${words[tens]} Puluh `;
        } else if (tens === 1) {
          wordResult += `${words[10 + unitsPlace]} `;
          return;
        }
        if (unitsPlace > 0 && tens !== 1) {
          wordResult += `${words[unitsPlace]} `;
        }

        wordResult += `${units[i]} `;
      }
    });

    return `${wordResult.trim()} Rupiah`;
  }
}
