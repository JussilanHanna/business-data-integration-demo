import { parseArgs } from "./parseArgs.js";
import { readCsv, writeCsv } from "./csv.js";
import { ensureDir, readJson, resolveOut } from "./files.js";
import { RawRowSchema } from "./schema.js";
import { formatZodError } from "./errors.js";
import { applyDefaultsAndMap } from "./mapping.js";
import { validateBusinessRules } from "./rules.js";
import type { IntegrationRow, MappingConfig, RejectedRow, RawRow } from "./types.js";
import { buildSummary } from "./summary.js";
import { promises as fs } from "node:fs";

function toIntegrationRow(raw: any, cfg: MappingConfig): IntegrationRow {
  const mapped = applyDefaultsAndMap(
    { account: raw.account, costCenter: raw.cost_center },
    cfg
  );

  return {
    externalId: raw.external_id,
    dateISO: raw.date,
    employeeId: raw.employee_id,
    employeeName: raw.employee_name,
    jobId: raw.job_id,
    hours: raw.hours,
    hourlyRate: raw.hourly_rate,
    account: mapped.account,
    costCenter: mapped.costCenter,
    description: raw.description?.trim() || undefined
  };
}

function rawRowToRejected(raw: RawRow, reason: string): RejectedRow {
  return { raw, reason };
}

async function main() {
  const args = parseArgs(process.argv);

  const mappingCfg = await readJson<MappingConfig>(args.mappings);
  const inputRows = await readCsv(args.input);

  const ok: IntegrationRow[] = [];
  const rejected: RejectedRow[] = [];

  for (const row of inputRows) {
    try {
      const validated = RawRowSchema.parse(row);
      const normalized = toIntegrationRow(validated, mappingCfg);

      const ruleError = validateBusinessRules(normalized);
      if (ruleError) {
        rejected.push(rawRowToRejected(row, ruleError));
        continue;
      }

      ok.push(normalized);
    } catch (err) {
      rejected.push(rawRowToRejected(row, formatZodError("Validation failed", err)));
    }
  }

  await ensureDir(args.outDir);

  // Write validated.csv
  await writeCsv(resolveOut(args.outDir, "validated.csv"), ok.map((r) => ({
    external_id: r.externalId,
    date: r.dateISO,
    employee_id: r.employeeId,
    employee_name: r.employeeName,
    job_id: r.jobId,
    hours: r.hours,
    hourly_rate: r.hourlyRate,
    account: r.account,
    cost_center: r.costCenter,
    line_amount: Number((r.hours * r.hourlyRate).toFixed(2)),
    description: r.description ?? ""
  })));

  // Write rejected.csv (raw + reason)
  await writeCsv(resolveOut(args.outDir, "rejected.csv"), rejected.map((x) => ({
    ...x.raw,
    reason: x.reason
  })));

  // Summary
  const summary = buildSummary(ok, rejected);
  await fs.writeFile(resolveOut(args.outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf-8");

  console.log("Done!");
  console.log(`OK rows: ${ok.length}`);
  console.log(`Rejected rows: ${rejected.length}`);
  console.log(`Output: ${args.outDir}/validated.csv, ${args.outDir}/rejected.csv, ${args.outDir}/summary.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
