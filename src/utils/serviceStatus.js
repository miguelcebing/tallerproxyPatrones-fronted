export const DEGRADED_ERROR_RATE = 15;

export function isServiceDegraded(service) {
  if (!service) {
    return false;
  }
  if (typeof service.degraded === "boolean") {
    return service.degraded;
  }
  return Number(service.errorRate) > DEGRADED_ERROR_RATE;
}
