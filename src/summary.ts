import type { IntegrationRow, RejectedRow } from "./types.js";

export function buildSummary(ok: IntegrationRow[], rejected: RejectedRow[]) {
  const totalHours = ok.reduce((a, r) => a + r.hours, 0);
  const totalAmount = ok.reduce((a, r) => a + r.hours * r.hourlyRate, 0);

  const byEmployee: Record<string, { hours: number; amount: number; rows: number }> = {};
  for (const r of ok) {
    const key = `${r.employeeId} ${r.employeeName}`;
    byEmployee[key] ??= { hours: 0, amount: 0, rows: 0 };
    byEmployee[key].hours += r.hours;
    byEmployee[key].amount += r.hours * r.hourlyRate;
    byEmployee[key].rows += 1;
  }

  return {
    okRows: ok.length,
    rejectedRows: rejected.length,
    totalHours,
    totalAmount,
    byEmployee
  };
}
