type LogFields = Record<string, string | number | boolean | undefined>;

export function logInfo(scope: string, message: string, fields: LogFields = {}): void {
  console.info(
    JSON.stringify({
      level: "info",
      scope,
      message,
      ts: new Date().toISOString(),
      ...fields,
    }),
  );
}

export function logError(scope: string, message: string, fields: LogFields = {}): void {
  console.error(
    JSON.stringify({
      level: "error",
      scope,
      message,
      ts: new Date().toISOString(),
      ...fields,
    }),
  );
}

export function requestIdFrom(headers: Headers): string {
  return headers.get("x-request-id") || "unknown";
}
