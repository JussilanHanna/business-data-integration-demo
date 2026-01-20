import type { MappingConfig } from "./types.js";

export function applyDefaultsAndMap(input: { account?: string; costCenter?: string }, cfg: MappingConfig) {
  const account = (input.account?.trim() || cfg.defaults.account).toString();
  const costCenter = (input.costCenter?.trim() || cfg.defaults.costCenter).toString();

  const mappedAccount = cfg.accounts[account] ? account : cfg.defaults.account;
  const mappedCostCenter = cfg.costCenters[costCenter] ? costCenter : cfg.defaults.costCenter;

  return {
    account: mappedAccount,
    costCenter: mappedCostCenter
  };
}
