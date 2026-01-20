export function formatZodError(prefix: string, err: unknown): string {
  if (typeof err === "object" && err && "issues" in err) {
    // zod error
    const issues = (err as any).issues as Array<{ path: (string | number)[]; message: string }>;
    const details = issues
      .map((i) => `${i.path.join(".") || "row"}: ${i.message}`)
      .join("; ");
    return `${prefix}: ${details}`;
  }
  return `${prefix}: invalid row`;
}
