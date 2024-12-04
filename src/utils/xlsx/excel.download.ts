import * as XLSX from "xlsx";

/**
 * Options for downloading Excel
 */
interface ExcelDownloadOptions {
  /** Sheet name in Excel
   * @example Sheet1
   */
  sheetName?: string;

  /** which columns to exclude
   * @example ["column1", "column2"]
   */
  excludeColumns?: string[];

  /** transform data 
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
}

/**
 * Class for downloading Excel or CSV
 */
export class JsonDownloader {
  /**
   * Generate Excel file from JSON
   * @param data Array of objects to be downloaded
   * @param options configuration optional to be downloaded
   * @returns Buffer Excel
   * @example JsonDownloader.generateExcel(data, {
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
  ): Buffer {
    // Default options
    const {
      sheetName = "Sheet1",
      excludeColumns = [],
      transformData,
      headerMapping = {},
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
    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
  }

  /**
   * Generate CSV file from JSON
   * @param data Array of objects to be downloaded
   * @param options Optional configuration for download
   * @returns CSV string
   * @example JsonDownloader.generateCSV(data, {
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
  ): string {
    const {
      excludeColumns = [],
      delimiter = ",",
      transformData,
      headerMapping = {},
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
    return [
      headers,
      ...mappedData.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(delimiter)
      ),
    ].join("\n");
  }
}
