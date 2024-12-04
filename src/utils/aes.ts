import CryptoJS from "crypto-js";

/**
 * Configuration type for AES encryption
 */
export type AESConfig = {
  secretKey: string;
  secretIV: string;
  encryptionMethod?: string;
};

/**
 * AES Encryption class for encrypting and decrypting data
 */
export class AES {
  /**
   * Generates a secure encryption key or IV from the provided secret
   * @param secret - The secret string to generate the key or IV from
   * @param length - Length of the output (32 for key, 16 for IV)
   * @returns Processed hash
   */
  private static generateSecret(secret: string, length: number): string {
    return CryptoJS.SHA512(secret).toString().substring(0, length);
  }

  /**
   * Encrypts the given data using AES
   * @param data - The data to encrypt
   * @param config - AES encryption configuration
   * @returns Encrypted data in base64 format
   */
  public static encrypt(data: string, config: AESConfig): string {
    if (!data) {
      throw new Error("Data to encrypt cannot be empty");
    }

    // Validasi metode enkripsi
    const validMethods = ["aes-256-cbc", "aes-128-cbc", "aes-256-ecb"];
    if (
      config.encryptionMethod &&
      !validMethods.includes(config.encryptionMethod)
    ) {
      throw new Error(
        `Encryption failed: Invalid encryption method ${config.encryptionMethod}`
      );
    }

    const key = CryptoJS.enc.Utf8.parse(
      this.generateSecret(config.secretKey, 32)
    );
    const iv = CryptoJS.enc.Utf8.parse(
      this.generateSecret(config.secretIV, 16)
    );

    try {
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(data),
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      return encrypted.toString();
    } catch (error) {
      throw new Error(
        `Encryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Decrypts the given encrypted data
   * @param encryptedData - The encrypted data in base64 format
   * @param config - AES encryption configuration
   * @returns Decrypted data
   */
  public static decrypt(encryptedData: string, config: AESConfig): string {
    if (!encryptedData) {
      throw new Error("Encrypted data cannot be empty");
    }

    // Validasi metode enkripsi
    const validMethods = ["aes-256-cbc", "aes-128-cbc", "aes-256-ecb"];
    if (
      config.encryptionMethod &&
      !validMethods.includes(config.encryptionMethod)
    ) {
      throw new Error(
        `Decryption failed: Invalid encryption method ${config.encryptionMethod}`
      );
    }

    const key = CryptoJS.enc.Utf8.parse(
      this.generateSecret(config.secretKey, 32)
    );
    const iv = CryptoJS.enc.Utf8.parse(
      this.generateSecret(config.secretIV, 16)
    );

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
