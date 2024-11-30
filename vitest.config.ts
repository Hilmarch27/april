import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Menggunakan global untuk expect
    environment: "node", // Cocok untuk utility
  },
});
