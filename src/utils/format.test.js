import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatDuration,
  formatPercent,
  formatTimestamp,
  toIsoInstant,
} from "../utils/format";

describe("format utils", () => {
  it("shouldFormatMillisecondsBelowOneSecond", () => {
    expect(formatDuration(87.4)).toBe("87 ms");
  });

  it("shouldFormatSecondsWhenDurationIsAboveOneThousandMilliseconds", () => {
    expect(formatDuration(1500)).toBe("1.50 s");
  });

  it("shouldReturnDashWhenDurationIsNotFinite", () => {
    expect(formatDuration(undefined)).toBe("—");
    expect(formatDuration(Number.NaN)).toBe("—");
  });

  it("shouldFormatPercentagesWithOneDecimal", () => {
    expect(formatPercent(15)).toBe("15.0 %");
    expect(formatPercent(33.333)).toBe("33.3 %");
  });

  it("shouldReturnDashWhenPercentIsNotFinite", () => {
    expect(formatPercent(undefined)).toBe("—");
  });

  it("shouldFormatSmallCountsWithoutSeparators", () => {
    expect(formatCount(999)).toBe("999");
  });

  it("shouldReturnDashWhenTimestampIsInvalid", () => {
    expect(formatTimestamp(null)).toBe("—");
    expect(formatTimestamp("not-a-date")).toBe("—");
  });

  it("shouldConvertLocalDateTimeToIsoInstant", () => {
    const isoInstant = toIsoInstant("2026-10-30T10:00");

    expect(isoInstant).toBeDefined();
    expect(new Date(isoInstant).getTime()).toBe(new Date("2026-10-30T10:00").getTime());
  });

  it("shouldReturnUndefinedWhenLocalDateTimeIsEmpty", () => {
    expect(toIsoInstant("")).toBeUndefined();
    expect(toIsoInstant(undefined)).toBeUndefined();
  });
});
