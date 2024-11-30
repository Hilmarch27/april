export class Text {
  /**
   * Returns a new string with the first letter of each word capitalized.
   * If the input string is falsy, returns undefined.
   * @example
   * capitalize("hello world") // "Hello World"
   */
  static capitalize(text?: string): string | undefined {
    if (!text) return undefined;
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Truncates a string to the specified length and appends an ellipsis ("...") if truncated.
   * If the text length is less than the maxLength, the original text is returned.
   * @example
   * truncate("Hello World, this is a test", 11) // "Hello World..."
   */
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  /**
   * Converts a string to kebab-case (lowercase words separated by hyphens).
   * @example
   * kebabCase("Hello World") // "hello-world"
   */
  static kebabCase(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, "$1-$2") // Handle camelCase
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();
  }

  /**
   * Converts a string to snake_case (lowercase words separated by underscores).
   * @example
   * snakeCase("Hello World") // "hello_world"
   */
  static snakeCase(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, "$1_$2") // Handle camelCase
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .toLowerCase();
  }

  /**
   * Converts a string to camelCase.
   * @example
   * camelCase("hello world") // "helloWorld"
   */
  static camelCase(text: string): string {
    return text
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  }

  /**
   * Converts a string to Title Case (capitalizes first letter of each word, ignoring small words).
   * Small words such as "and", "or", "but", etc., are excluded unless they are the first word.
   * @example
   * titleCase("hello and welcome to the world") // "Hello and Welcome to the World"
   */
  static titleCase(text: string): string {
    const smallWords = [
      "and",
      "or",
      "but",
      "for",
      "nor",
      "on",
      "at",
      "to",
      "a",
      "the",
    ];
    return text
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 || !smallWords.includes(word)
          ? word.charAt(0).toUpperCase() + word.slice(1)
          : word
      )
      .join(" ");
  }

  /**
   * Removes all spaces from a string.
   * @example
   * removeSpaces("  Hello World  ") // "HelloWorld"
   */
  static removeSpaces(text: string): string {
    return text.replace(/\s+/g, "");
  }

  /**
   * Reverses the order of characters in a string.
   * @example
   * reverse("hello") // "olleh"
   */
  static reverse(text: string): string {
    return text.split("").reverse().join("");
  }

  /**
   * Counts the number of words in a string.
   * @example
   * countWords("Hello world, this is a test") // 6
   */
  static countWords(text: string): number {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }

  /**
   * Wraps text into multiple lines at a specified width.
   * @param text - The input string
   * @param width - The maximum line width
   * @returns The wrapped string
   * @example
   * wordWrap("Hello world, this is a test of the word wrapping utility.", 15)
   * // "Hello world,\nthis is a test\nof the word\nwrapping utility."
   */
  static wordWrap(text: string, width: number): string {
    const regex = new RegExp(`(.{1,${width}})(\\s|$)`, "g");
    return text.match(regex)?.join("\n").trim() || text;
  }
}
