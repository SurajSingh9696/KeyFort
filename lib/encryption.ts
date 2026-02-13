import CryptoJS from "crypto-js";

/**
 * Encrypts a password using AES-256 encryption
 * @param plaintext - The password to encrypt
 * @param masterPassword - The user's master password (used to derive encryption key)
 * @returns Encrypted password string
 */
export function encryptPassword(plaintext: string, masterPassword: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(plaintext, masterPassword).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt password");
  }
}

/**
 * Decrypts an encrypted password
 * @param ciphertext - The encrypted password
 * @param masterPassword - The user's master password
 * @returns Decrypted password string
 */
export function decryptPassword(ciphertext: string, masterPassword: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, masterPassword);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error("Decryption failed - incorrect master password");
    }
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt password");
  }
}

/**
 * Generates a secure random password
 * @param options - Password generation options
 * @returns Generated password
 */
export interface PasswordGeneratorOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(options: PasswordGeneratorOptions): string {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  let charset = "";
  let password = "";

  if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charset.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  // Ensure at least one character from each selected type
  const guaranteedChars: string[] = [];
  if (uppercase) guaranteedChars.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]);
  if (lowercase) guaranteedChars.push("abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]);
  if (numbers) guaranteedChars.push("0123456789"[Math.floor(Math.random() * 10)]);
  if (symbols) guaranteedChars.push("!@#$%^&*()_+-="[Math.floor(Math.random() * 14)]);

  // Fill the rest randomly
  for (let i = guaranteedChars.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Add guaranteed chars and shuffle
  const allChars = (password + guaranteedChars.join("")).split("");
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join("").slice(0, length);
}

/**
 * Calculates password strength
 * @param password - Password to check
 * @returns Strength score (0-4) and label
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  percentage: number;
} {
  let score = 0;

  if (!password) return { score: 0, label: "Very Weak", percentage: 0 };

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.floor((score / 6) * 4));

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const label = labels[normalizedScore];
  const percentage = (normalizedScore / 4) * 100;

  return { score: normalizedScore, label, percentage };
}

/**
 * Hash a master password using bcrypt-compatible method
 * This is done server-side only
 */
export async function hashMasterPassword(password: string): Promise<string> {
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a master password against its hash
 */
export async function verifyMasterPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(password, hash);
}
