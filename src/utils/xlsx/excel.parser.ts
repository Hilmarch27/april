import * as XLSX from "xlsx";
import { z } from "zod";
import { saveAs } from "file-saver";

/**
 * Konfigurasi untuk parsing Excel
 * @template T Tipe data yang diharapkan
 */
export interface ExcelParserOptions<T> {
  /** List of expected headers
   *  @example ["Full Name", "Address", "Phone"]
   */
  expectedHeaders: string[];

  /**
   * Zod schema for data validation
   * @example z.object({ full_name: z.string(), address: z.string(), phone: z.number() })
   */
  schema: z.ZodType<T>;

  /**
   * Field mapping configuration
   * Maps Excel headers to target data fields
   * @example { "Full Name": "full_name", "Address": "address", "Phone": "phone" }
   */
  fieldMapping: {
    [excelHeader: string]: string;
  };

  /** Custom transformations for specific fields */
  transformations?: {
    [targetField: string]: (value: any) => any;
  };
}

/**
 * Utility class for parsing and validating Excel files
 * @template T Tipe data target setelah parsing
 */
export class ExcelParser<T> {
  /** Konfigurasi parser */
  private options: ExcelParserOptions<T>;

  /**
   * Konstruktor ExcelParser
   * @param options Konfigurasi parsing Excel
   */
  constructor(options: ExcelParserOptions<T>) {
    this.options = options;
  }

  /**
   * Parsing file Excel
   * @param file File Excel yang akan diproses
   * @returns Promise dengan data yang sudah diproses
   */
  async parseExcel(file: File): Promise<T[]> {
    // 1. Validasi file ada
    if (!file) {
      throw new Error("Tidak ada file yang diunggah");
    }

    // 2. Membaca file
    const arrayBuffer = await this.readFileAsArrayBuffer(file);

    // 3. Konversi ke JSON
    const jsonData = this.convertToJson(arrayBuffer);

    // 4. Validasi header
    this.validateHeaders(jsonData);

    // 5. Transform data
    const transformedData = this.transformData(jsonData);

    // 6. Validasi data dengan skema
    return this.validateData(transformedData);
  }

  /**
   * Membaca file sebagai ArrayBuffer
   * @param file File yang akan dibaca
   * @returns Promise dengan ArrayBuffer
   */
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        resolve(arrayBuffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Konversi file Excel ke JSON
   * @param arrayBuffer ArrayBuffer dari file Excel
   * @returns Array data JSON
   */
  private convertToJson(arrayBuffer: ArrayBuffer): any[] {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  /**
   * Validasi header file Excel
   * @param data Data JSON dari Excel
   */
  private validateHeaders(data: any[]): void {
    if (data.length === 0) {
      throw new Error("File Excel kosong");
    }

    const fileHeaders = Object.keys(data[0]);
    const missingHeaders = this.options.expectedHeaders.filter(
      (header) => !fileHeaders.includes(header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Header tidak valid. Header yang hilang: ${missingHeaders.join(", ")}`
      );
    }
  }

  /**
   * Transformasi data dari header Excel ke field target
   * @param data Data JSON dari Excel
   * @returns Data yang sudah ditransformasi
   */
  private transformData(data: any[]): any[] {
    return data.map((row) => {
      const transformedRow: any = {};

      // Map from Excel headers to target fields
      Object.entries(this.options.fieldMapping).forEach(
        ([excelHeader, targetField]) => {
          let value = row[excelHeader];

          // Apply custom transformation if exists
          if (this.options.transformations?.[targetField]) {
            value = this.options.transformations[targetField](value);
          } else {
            if (this.options.schema instanceof z.ZodObject) {
              // Automatic transformation based on Zod schema
              const fieldSchema = this.options.schema.shape[targetField];

              if (fieldSchema) {
                try {
                  // Comprehensive type conversions for Zod types
                  if (fieldSchema instanceof z.ZodNumber) {
                    // Convert to number, handle various input types
                    value =
                      value === ""
                        ? null
                        : value === null
                        ? null
                        : Number(value);
                  }
                  // Check if it's a string schema
                  else if (fieldSchema instanceof z.ZodString) {
                    // Convert to trimmed string, handle null/undefined
                    value =
                      value === null || value === undefined
                        ? ""
                        : String(value).trim();
                  }
                  // Boolean conversion
                  else if (fieldSchema instanceof z.ZodBoolean) {
                    // Handle various truthy/falsy representations
                    value =
                      value === true ||
                      value === "true" ||
                      value === "1" ||
                      value === 1;
                  }
                  // Date conversion
                  else if (fieldSchema instanceof z.ZodDate) {
                    // Handle different date formats
                    value = value ? new Date(value) : null;
                  }
                  // Array conversion
                  else if (fieldSchema instanceof z.ZodArray) {
                    // Convert to array if not already
                    value = Array.isArray(value) ? value : value ? [value] : [];
                  }
                  // Enum conversion
                  else if (fieldSchema instanceof z.ZodEnum) {
                    // Ensure value is a valid enum value
                    value = fieldSchema.options.includes(value) ? value : null;
                  }
                  // Optional type handling
                  else if (fieldSchema instanceof z.ZodOptional) {
                    // Keep the value if it's not undefined
                    value = value !== undefined ? value : null;
                  }
                  // Nullable type handling
                  else if (fieldSchema instanceof z.ZodNullable) {
                    // Allow null values
                    value = value === "" ? null : value;
                  }
                } catch (error) {
                  // If transformation fails, log warning and keep original value
                  console.warn(
                    `Automatic transformation failed for ${targetField}:`,
                    error
                  );
                }
              }
            }
          }

          // Assign the transformed value directly
          transformedRow[targetField] = value;
        }
      );

      return transformedRow;
    });
  }

  /**
   * Validasi data dengan skema Zod
   * @param data Data yang sudah ditransformasi
   * @returns Data yang valid
   */
  private validateData(data: any[]): T[] {
    return data.map((row, index) => {
      try {
        return this.options.schema.parse(row);
      } catch (error) {
        throw new Error(`Kesalahan validasi pada baris ${index + 2}: ${error}`);
      }
    });
  }

  /**
   * Generate template Excel
   * @param exampleData Contoh data untuk template
   * @param filename Nama file template
   */
  generateExcelTemplate(
    exampleData: Partial<T>[],
    filename: string = "template.xlsx"
  ): void {
    // Konversi kembali ke format header Excel
    const templateData = exampleData.map((item) => {
      const excelRow: any = {};

      Object.entries(this.options.fieldMapping).forEach(
        ([excelHeader, targetField]) => {
          excelRow[excelHeader] = item[targetField as keyof Partial<T>];
        }
      );

      return excelRow;
    });

    // Buat worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    // Generate file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, filename);
  }
}
