import { promises as fs } from "node:fs";
import Papa from "papaparse";
import type { RawRow } from "./types.js";

export async function readCsv(filepath: string): Promise<RawRow[]> {
  const csvText = await fs.readFile(filepath, "utf-8");
  const parsed = Papa.parse<RawRow>(csvText, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors?.length) {
    throw new Error(`CSV parse error: ${parsed.errors[0]?.message}`);
  }
  return (parsed.data || []).map((row) => row ?? {});
}

export async function writeCsv(filepath: string, rows: Record<string, unknown>[]) {
  const csv = Papa.unparse(rows, { quotes: false });
  await fs.writeFile(filepath, csv, "utf-8");
}
