type ClientErrorPayload = {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent?: string;
};

const TELEMETRY_ENDPOINT = "/api/telemetry/error";

export async function reportClientError(error: Error, componentStack?: string | null) {
  const payload: ClientErrorPayload = {
    message: error.message,
    stack: error.stack,
    componentStack: componentStack ?? undefined,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(TELEMETRY_ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }

    await fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch (err) {
    console.error("Telemetry dispatch failed", err);
  }
}
