import crypto from "crypto";

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
    return crypto
      .createHash("sha512")
      .update(secret)
      .digest("hex")
      .substring(0, length);
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

    const encryptionMethod = config.encryptionMethod || "aes-256-cbc";
    const key = AES.generateSecret(config.secretKey, 32);
    const iv = AES.generateSecret(config.secretIV, 16);

    try {
      const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
      const encryptedData = Buffer.from(
        cipher.update(data, "utf8", "hex") + cipher.final("hex")
      ).toString("base64");
      return encryptedData;
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

    const encryptionMethod = config.encryptionMethod || "aes-256-cbc";
    const key = AES.generateSecret(config.secretKey, 32);
    const iv = AES.generateSecret(config.secretIV, 16);

    try {
      const buff = Buffer.from(encryptedData, "base64");
      const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
      const decryptedData =
        decipher.update(buff.toString("utf8"), "hex", "utf8") +
        decipher.final("utf8");
      return decryptedData;
    } catch (error) {
      throw new Error(
        `Decryption failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
