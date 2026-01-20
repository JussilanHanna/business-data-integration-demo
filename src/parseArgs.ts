import { Command } from "commander";

export type CliArgs = {
  input: string;
  mappings: string;
  outDir: string;
};

export function parseArgs(argv: string[]): CliArgs {
  const program = new Command();

  program
    .requiredOption("-i, --input <path>", "Input CSV path")
    .option("-m, --mappings <path>", "Mappings JSON path", "sample/mappings.json")
    .option("-o, --outDir <path>", "Output directory", "output");

  program.parse(argv);

  const opts = program.opts();
  return {
    input: opts.input,
    mappings: opts.mappings,
    outDir: opts.outDir
  };
}
