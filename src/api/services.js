import { request } from "./client";

export function fetchSummary(signal) {
  return request("/api/metrics/summary", { signal });
}

export function fetchLogs({ service, status, from, to, page = 0, size = 20 } = {}, signal) {
  const params = new URLSearchParams();
  if (service) {
    params.set("service", service);
  }
  if (status) {
    params.set("status", status);
  }
  if (from) {
    params.set("from", from);
  }
  if (to) {
    params.set("to", to);
  }
  params.set("page", String(page));
  params.set("size", String(size));

  return request(`/api/metrics/logs?${params.toString()}`, { signal });
}

export function simulateLoad(signal) {
  return request("/api/metrics/simulate-load", { method: "POST", signal });
}
