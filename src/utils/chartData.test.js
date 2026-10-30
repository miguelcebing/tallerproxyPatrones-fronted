import { describe, expect, it } from "vitest";
import { buildChartData } from "../utils/chartData";

function buildLog(serviceId, durationMs, seconds) {
  return {
    serviceId,
    durationMs,
    timestamp: `2026-10-30T10:00:${String(seconds).padStart(2, "0")}Z`,
  };
}

describe("buildChartData", () => {
  it("shouldReturnEmptyArrayWhenThereAreNoEntries", () => {
    expect(buildChartData([])).toEqual([]);
    expect(buildChartData(undefined)).toEqual([]);
  });

  it("shouldKeepOnlyTheLastTwentyCallsPerService", () => {
    const entries = Array.from({ length: 25 }, (_, index) =>
      buildLog("inventory-service", index, index),
    );

    const data = buildChartData(entries);

    expect(data).toHaveLength(20);
    expect(data[0]["inventory-service"]).toBe(5);
    expect(data[19]["inventory-service"]).toBe(24);
  });

  it("shouldAlignSeriesByCallIndex", () => {
    const entries = [
      buildLog("inventory-service", 10, 0),
      buildLog("payment-service", 20, 1),
      buildLog("order-service", 30, 2),
    ];

    const data = buildChartData(entries);

    expect(data).toHaveLength(1);
    expect(data[0]).toEqual({
      call: 1,
      "inventory-service": 10,
      "payment-service": 20,
      "order-service": 30,
    });
  });

  it("shouldIgnoreUnknownServices", () => {
    const entries = [buildLog("shipping-service", 99, 0)];

    expect(buildChartData(entries)).toEqual([]);
  });
});
