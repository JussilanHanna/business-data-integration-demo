import { promises as fs } from "node:fs";
import path from "node:path";

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJson<T>(filepath: string): Promise<T> {
  const txt = await fs.readFile(filepath, "utf-8");
  return JSON.parse(txt) as T;
}

export function resolveOut(dir: string, filename: string) {
  return path.join(dir, filename);
}
