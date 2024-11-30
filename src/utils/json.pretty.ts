type ColorFunction = (text: string) => string;

/**
 * Utility untuk pewarnaan console di berbagai platform
 */
class ConsoleColor {
  // Warna untuk browser console
  private static browserColors = {
    reset: "color: inherit",
    red: "color: red",
    green: "color: green",
    yellow: "color: orange",
    blue: "color: blue",
    magenta: "color: purple",
    cyan: "color: teal",
    white: "color: black",
    gray: "color: gray",
  };

  // Kode warna untuk Node.js (chalk-like)
  private static nodeColors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
  };

  /**
   * Deteksi lingkungan runtime
   */
  private static detectEnvironment(): "browser" | "node" {
    // Cek apakah di browser
    if (typeof window !== "undefined" && window.console) {
      return "browser";
    }
    // Diasumsikan Node.js jika bukan browser
    return "node";
  }

  /**
   * Membuat fungsi pewarnaan
   */
  static getColorFunction(color: keyof typeof this.nodeColors): ColorFunction {
    const env = this.detectEnvironment();

    if (env === "browser") {
      return (text: string) => {
        console.log(`%c${text}`, this.browserColors[color]);
        return text;
      };
    }

    // Node.js/terminal
    return (text: string) => {
      const colorCode = this.nodeColors[color];
      const resetCode = this.nodeColors.reset;
      return `${colorCode}${text}${resetCode}`;
    };
  }

  /**
   * Warna standar untuk berbagai tipe data
   */
  static colors = {
    null: this.getColorFunction("red"),
    undefined: this.getColorFunction("yellow"),
    string: this.getColorFunction("green"),
    number: this.getColorFunction("cyan"),
    boolean: this.getColorFunction("magenta"),
    array: this.getColorFunction("white"),
    object: this.getColorFunction("white"),
  };
}

/**
 * Opsi untuk konfigurasi formatting JSON
 */
interface JsonPrettyOptions {
  /**
   * Jumlah spasi untuk indentasi
   * @default 2
   */
  indent?: number;

  /**
   * Apakah akan menampilkan deskripsi tipe data
   * @default false
   */
  showDataType?: boolean;

  /**
   * Aktifkan pewarnaan
   * @default true
   */
  colorize?: boolean;
}

/**
 * Utility untuk memformat JSON dengan berbagai opsi
 */
export class JsonPretty {
  /**
   * Memformat objek menjadi string JSON yang mudah dibaca
   * @param data - Data yang akan diformat
   * @param options - Opsi konfigurasi formatting
   * @returns String JSON yang diformat
   */
  static format(data: any, options: JsonPrettyOptions = {}): string {
    const { indent = 2, showDataType = false, colorize = true } = options;

    // Fungsi rekursif untuk mendapatkan tipe data dengan deskripsi
    const getFormattedValue = (
      value: any,
      currentIndent: number = 0
    ): string => {
      const applyColor = (
        text: string,
        colorType: keyof typeof ConsoleColor.colors
      ) => {
        if (!colorize) return text;
        return ConsoleColor.colors[colorType](text);
      };

      if (value === null) {
        return applyColor(showDataType ? "(null) null" : "null", "null");
      }

      const type = typeof value;

      if (type === "undefined") {
        return applyColor(
          showDataType ? "(undefined) undefined" : "undefined",
          "undefined"
        );
      }

      if (type === "string") {
        return applyColor(
          showDataType ? `(string) "${value}"` : `"${value}"`,
          "string"
        );
      }

      if (type === "number") {
        return applyColor(
          showDataType ? `(number) ${value}` : `${value}`,
          "number"
        );
      }

      if (type === "boolean") {
        return applyColor(
          showDataType ? `(boolean) ${value}` : `${value}`,
          "boolean"
        );
      }

      if (Array.isArray(value)) {
        const arrayIndent = currentIndent + indent;
        const arrayContent = value
          .map(
            (item) =>
              " ".repeat(arrayIndent) + getFormattedValue(item, arrayIndent)
          )
          .join(",\n");

        const arrayWrapper = showDataType
          ? applyColor(
              `(array) [\n${arrayContent}\n${" ".repeat(currentIndent)}]`,
              "array"
            )
          : `[\n${arrayContent}\n${" ".repeat(currentIndent)}]`;

        return arrayWrapper;
      }

      if (type === "object") {
        const objectIndent = currentIndent + indent;
        const objectEntries = Object.entries(value)
          .map(
            ([key, val]) =>
              `${" ".repeat(objectIndent)}"${key}": ${getFormattedValue(
                val,
                objectIndent
              )}`
          )
          .join(",\n");

        const objectWrapper = showDataType
          ? applyColor(
              `(object) {\n${objectEntries}\n${" ".repeat(currentIndent)}}`,
              "object"
            )
          : `{\n${objectEntries}\n${" ".repeat(currentIndent)}}`;

        return objectWrapper;
      }

      return String(value);
    };

    return getFormattedValue(data);
  }

  /**
   * Mencetak JSON ke konsol dengan formatting
   * @param data - Data yang akan dicetak
   * @param options - Opsi konfigurasi formatting
   */
  static print(data: any, options: JsonPrettyOptions = {}): void {
    console.log(this.format(data, options));
  }

  /**
   * Mencetak error dengan informasi detail
   * @param error - Objek error yang akan dicetak
   */
  static printError(error: unknown): void {
    const errorColor = ConsoleColor.getColorFunction("red");

    if (error instanceof Error) {
      // Untuk Error standar JavaScript
      console.error(errorColor(`Error: ${error.message}`));

      // Tambahkan informasi stack trace jika tersedia
      if (error.stack) {
        console.error(errorColor(`Stack Trace:\n${error.stack}`));
      }
    } else if (typeof error === "string") {
      // Untuk pesan error dalam bentuk string
      console.error(errorColor(`Error: ${error}`));
    } else {
      // Untuk tipe error yang tidak dikenal
      console.error(errorColor("Unknown error occurred"));

      // Tambahkan serialisasi error untuk debugging
      try {
        console.error(
          errorColor("Error details: ") + JSON.stringify(error, null, 2)
        );
      } catch {
        console.error(errorColor("Could not serialize error object"));
      }
    }
  }
}
