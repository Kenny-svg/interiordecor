export const ANALYTICS_EVENTS = [
  "imagine_started",
  "voice_used",
  "generate_succeeded",
  "brief_sent",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export function track(
  event: AnalyticsEvent,
  fields: { demo?: boolean; n?: number } = {},
): void {
  if (typeof window === "undefined") {
    return;
  }
  const body = JSON.stringify({
    event,
    demo: fields.demo,
    n: fields.n,
  });
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/events", blob)) {
      return;
    }
  }
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
