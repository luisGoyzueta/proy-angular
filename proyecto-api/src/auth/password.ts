import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;
    const [salt, hash] = parts;
    if (!salt || !hash) return false;

    if (!/^[0-9a-f]{32}$/i.test(salt)) return false;
    if (!/^[0-9a-f]{128}$/i.test(hash)) return false;

    const storedKey = Buffer.from(hash, "hex");
    const derivedKey = (await scrypt(
      password,
      salt,
      storedKey.length,
    )) as Buffer;

    return timingSafeEqual(storedKey, derivedKey);
  } catch {
    return false;
  }
}
