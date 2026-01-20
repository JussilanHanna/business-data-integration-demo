export type RawRow = Record<string, string | undefined>;

export type IntegrationRow = {
  externalId: string;
  dateISO: string; // YYYY-MM-DD
  employeeId: number;
  employeeName: string;
  jobId: string;
  hours: number;
  hourlyRate: number;
  account: string;
  costCenter: string;
  description?: string;
};

export type MappingConfig = {
  accounts: Record<string, string>;
  costCenters: Record<string, string>;
  defaults: {
    account: string;
    costCenter: string;
  };
};

export type RejectedRow = {
  raw: RawRow;
  reason: string;
};
