import type { IntegrationRow } from "./types.js";

export function validateBusinessRules(row: IntegrationRow): string | null {
  // Esimerkki: negatiivinen / liian iso tunti jo estetty schema:ssa,
  // mutta tehdään vielä "oikean elämän" sääntöjä.

  if (row.account === "9999") {
    return "Account 9999 is not allowed (demo rule)";
  }

  if (row.hours > 12 && row.jobId.startsWith("JOB-")) {
    return "More than 12 hours/day requires approval (demo rule)";
  }

  return null;
}
