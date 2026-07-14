export function reportError(error: Error | unknown, contextInfo?: string) {
  // In production, this can send errors to Sentry, Datadog, or your custom log drains.
  console.error(`[Error Monitor] ${contextInfo ? `(${contextInfo})` : ""}:`, error);

  // Example: send client-side crash telemetry to a mock/analytics endpoint if window is defined
  if (typeof window !== "undefined") {
    // window.telemetry?.sendError(...)
  }
}
