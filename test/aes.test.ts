import { describe, it, expect } from "bun:test";
import { AES} from "../src/utils/aes";
import type { AESConfig } from "../src/utils/aes";

// Mocked secret key and IV for testing
const config: AESConfig = {
  secretKey: "testSecretKey",
  secretIV: "testSecretIV",
  encryptionMethod: "aes-256-cbc", // Default or custom method
};

// Example data to encrypt and decrypt
const testData = "Hello, World!";

describe("AES Encryption/Decryption", () => {
  it("should encrypt data correctly", () => {
    const encryptedData = AES.encrypt(testData, config);
    expect(encryptedData).toBeDefined(); // The result should be a valid encrypted string
    expect(typeof encryptedData).toBe("string");
    expect(encryptedData).not.toBe(testData); // Encrypted data should be different from original
  });

  it("should decrypt data correctly", () => {
    const encryptedData = AES.encrypt(testData, config);
    const decryptedData = AES.decrypt(encryptedData, config);
    expect(decryptedData).toBe(testData); // The decrypted data should match the original
  });

  it("should throw an error if encrypting empty data", () => {
    expect(() => AES.encrypt("", config)).toThrowError(
      "Data to encrypt cannot be empty"
    );
  });

  it("should throw an error if decrypting empty data", () => {
    expect(() => AES.decrypt("", config)).toThrowError(
      "Encrypted data cannot be empty"
    );
  });

  it("should handle invalid encryption/decryption methods", () => {
    const invalidConfig: AESConfig = {
      secretKey: "testSecretKey",
      secretIV: "testSecretIV",
      encryptionMethod: "invalid-method" as any, // Invalid method
    };

    expect(() => AES.encrypt(testData, invalidConfig)).toThrowError(
      "Encryption failed:"
    );
    expect(() =>
      AES.decrypt("invalidEncryptedData", invalidConfig)
    ).toThrowError("Decryption failed:");
  });
});
