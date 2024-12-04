import { serve } from "bun";
import { JsonDownloader } from "./utils/xlsx/excel.download.ts";

export { AES } from "./utils/aes.ts";
export type { AESConfig } from "./utils/aes.ts";
export { Text } from "./utils/text.ts";
export { Moment } from "./utils/moment.ts";
export { Currency } from "./utils/currency.ts";
export { JsonPretty, Csl } from "./utils/json.pretty.ts";
export { ExcelParser } from "./utils/xlsx/excel.parser.ts";
export { JsonDownloader } from "./utils/xlsx/excel.download.ts";


// Handler untuk download Excel
async function handleDownloadExcel() {
  try {
    // Data default
    const data = [
      { name: "John Doe", age: 30, email: "john@example.com" },
      { name: "Jane Smith", age: 25, email: "jane@example.com" },
    ];

    // Konfigurasi langsung di server
    const downloadOptions = {
      filename: "data.xlsx",
      sheetName: "UserData",
      excludeColumns: ["email"], // Kolom yang akan dihapus
      headerMapping: { name: "Full Name", age: "Age (Years)" }, // Mapping header
    };

    // Generate Excel
    const excelResult = JsonDownloader.generateExcel(data, downloadOptions);

    // Set headers dan respons
    return new Response(
      excelResult,
      {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${downloadOptions.filename}"`,
        },
      }
    );
  } catch (error: any) {
    // Tangani error
    return new Response(
      JSON.stringify({
        error: "Gagal membuat file Excel",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Handler untuk download CSV
async function handleDownloadCSV() {
  try {
    // Data default
    const data = [
      { name: "John Doe", age: 30, email: "john@example.com" },
      { name: "Jane Smith", age: 25, email: "jane@example.com" },
    ];

    // Konfigurasi langsung di server
    const downloadOptions = {
      filename: "data.csv",
      excludeColumns: ["age"], // Kolom yang akan dihapus
      delimiter: ",", // Separator CSV
      headerMapping: { name: "Full Name", email: "Email Address" }, // Mapping header
      transformData: (item: any) => ({
        ...item,
        name: item.name.toUpperCase(),
      }),
    };

    // Generate CSV
    const csvResult = JsonDownloader.generateCSV(data, downloadOptions);

    // Set headers dan respons
    return new Response(
    csvResult,
      {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${downloadOptions.filename}"`,
        },
      }
    );
  } catch (error : any) {
    // Tangani error
    return new Response(
      JSON.stringify({
        error: "Gagal membuat file CSV",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Jalankan server menggunakan Bun.js
serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/api/download/excel") {
      return handleDownloadExcel();
    } else if (req.method === "GET" && url.pathname === "/api/download/csv") {
      return handleDownloadCSV();
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Server running at http://localhost:3000`);