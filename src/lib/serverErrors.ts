import { reportError } from "./errorMonitor";

export function handleServerError(
  error: any,
  fallbackMessage: string = "İşlem gerçekleştirilemedi.",
): never {
  reportError(error, "Server Function Error");
  const msg = error?.message || "";

  if (
    msg.includes("Forbidden") ||
    msg.includes("forbidden") ||
    msg.includes("AppCheck") ||
    msg.includes("has_role") ||
    msg.includes("JWT")
  ) {
    throw new Error("Forbidden");
  }
  if (msg.includes("not found") || msg.includes("Not found") || msg.includes("no rows")) {
    throw new Error("Not found");
  }
  throw new Error(fallbackMessage);
}
