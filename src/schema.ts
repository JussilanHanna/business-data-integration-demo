import { z } from "zod";

const toNumber = (v: unknown) => {
  if (typeof v !== "string") return v;
  const cleaned = v.trim().replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : v;
};

const normalizeDate = (v: unknown) => {
  if (typeof v !== "string") return v;
  const s = v.trim();

  // Accept: YYYY-MM-DD, YYYY/MM/DD, DD.MM.YYYY
  const iso = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const fi = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (fi) return `${fi[3]}-${fi[2]}-${fi[1]}`;

  return v;
};

export const RawRowSchema = z.object({
  external_id: z.string().min(1),
  date: z.preprocess(normalizeDate, z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  employee_id: z.preprocess(toNumber, z.number().int().positive()),
  employee_name: z.string().min(1),
  job_id: z.string().min(1),
  hours: z.preprocess(toNumber, z.number().positive().max(24)),
  hourly_rate: z.preprocess(toNumber, z.number().nonnegative().max(1000)),
  account: z.string().optional(),
  cost_center: z.string().optional(),
  description: z.string().optional()
});

export type RawRowValidated = z.infer<typeof RawRowSchema>;
