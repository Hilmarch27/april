import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

/**
 * Options for downloading Excel
 */
interface ExcelDownloadOptions {
  /** Name for file
   * @example data.xlsx/csv
   */
  fileName?: string;

  /** Sheet name in Excel
   * @example Sheet1
   */
  sheetName?: string;

  /** which columns to exclude
   * @example ["column1", "column2"]
   */
  excludeColumns?: string[];

  /** tranform data 
   * @example transformData: (item) => ({
      ...item,
      name: item.name.toUpperCase(),
    })
   */
  transformData?: (data: any) => any;

  /** Custom header mapping
   * @example headerMapping: {
      originalHeader: "newHeader"
   }
   */
  headerMapping?: {
    [originalHeader: string]: string;
  };

  /** Save to server
   * @example saveToServer: true or false
   */
  saveToServer?: boolean;
}

/**
 * Class for downloading Excel or CSV
 */
export class JsonDownloader {
  /**
   * Generate Excel file from JSON
   * @param data Array of objects to be downloaded
   * @param options configuration optional to be downloaded
   * @returns Buffer Excel or path file
   * @example JsonDownloader.generateExcel(data, {
   * fileName: "data.xlsx",
   * sheetName: "Sheet1",
   * excludeColumns: ["column1", "column2"]
   * headerMapping: {
    originalHeader: "newHeader"
   }
   })
   */
  static generateExcel(
    data: any[],
    options: ExcelDownloadOptions = {}
  ): Buffer | string {
    // Default options
    const {
      fileName = "data.xlsx",
      sheetName = "Sheet1",
      excludeColumns = [],
      transformData,
      headerMapping = {},
      saveToServer = false,
    } = options;

    // Transform data jika ada fungsi transformasi
    const processedData = transformData ? data.map(transformData) : data;

    // Filter kolom yang tidak ingin di-include
    const filteredData = processedData.map((item) => {
      const filteredItem = { ...item };
      excludeColumns.forEach((col) => delete filteredItem[col]);
      return filteredItem;
    });

    // Mapping header jika ada
    const mappedData = filteredData.map((item) => {
      const mappedItem: any = {};
      Object.entries(item).forEach(([key, value]) => {
        const mappedHeader = headerMapping[key] || key;
        mappedItem[mappedHeader] = value;
      });
      return mappedItem;
    });

    // Buat worksheet dari data
    const worksheet = XLSX.utils.json_to_sheet(mappedData);

    // Buat workbook baru
    const workbook = XLSX.utils.book_new();

    // Tambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Jika saveToServer true, simpan file di server
    if (saveToServer) {
      const filePath = path.resolve(process.cwd(), fileName);
      fs.writeFileSync(filePath, excelBuffer);
      return filePath;
    }

    // Kembalikan buffer untuk download langsung
    return excelBuffer;
  }

  /**
   * Generate CSV file from JSON
   * @param data Array of objects to be downloaded
   * @param options Optional configuration for download
   * @returns string CSV or file path
   * @example JsonDownloader.generateCSV(data, {
   * fileName?: "data.csv",
   * delimiter?: ";",
   * excludeColumns?: ["column1", "column2"]
   * headerMapping
   * originalHeader: "newHeader"
   * })
   */
  static generateCSV(
    data: any[],
    options: Omit<ExcelDownloadOptions, "sheetName"> & {
      delimiter?: string;
    } = {}
  ): string | string {
    const {
      fileName = "data.csv",
      excludeColumns = [],
      delimiter = ",",
      transformData,
      headerMapping = {},
      saveToServer = false,
    } = options;

    // Transform data jika ada fungsi transformasi
    const processedData = transformData ? data.map(transformData) : data;

    // Filter kolom yang tidak ingin di-include
    const filteredData = processedData.map((item) => {
      const filteredItem = { ...item };
      excludeColumns.forEach((col) => delete filteredItem[col]);
      return filteredItem;
    });

    // Mapping header jika ada
    const mappedData = filteredData.map((item) => {
      const mappedItem: any = {};
      Object.entries(item).forEach(([key, value]) => {
        const mappedHeader = headerMapping[key] || key;
        mappedItem[mappedHeader] = value;
      });
      return mappedItem;
    });

    // Dapatkan header
    const headers = Object.keys(mappedData[0] || {}).join(delimiter);

    // Konversi ke CSV
    const csv = [
      headers,
      ...mappedData.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(delimiter)
      ),
    ].join("\n");

    // Jika saveToServer true, simpan file di server
    if (saveToServer) {
      const filePath = path.resolve(process.cwd(), fileName);
      fs.writeFileSync(filePath, csv, { encoding: "utf-8" });
      return filePath;
    }

    // Kembalikan string CSV
    return csv;
  }
}
