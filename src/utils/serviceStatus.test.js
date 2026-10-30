import { describe, expect, it } from "vitest";
import { isServiceDegraded } from "../utils/serviceStatus";

describe("isServiceDegraded", () => {
  it("shouldBeFalseWhenErrorRateIsExactlyFifteen", () => {
    expect(isServiceDegraded({ errorRate: 15 })).toBe(false);
  });

  it("shouldBeTrueWhenErrorRateIsAboveFifteen", () => {
    expect(isServiceDegraded({ errorRate: 15.01 })).toBe(true);
  });

  it("shouldPreferTheBackendFlagWhenPresent", () => {
    expect(isServiceDegraded({ errorRate: 40, degraded: false })).toBe(false);
    expect(isServiceDegraded({ errorRate: 0, degraded: true })).toBe(true);
  });

  it("shouldBeFalseWhenServiceIsMissing", () => {
    expect(isServiceDegraded(undefined)).toBe(false);
  });
});
