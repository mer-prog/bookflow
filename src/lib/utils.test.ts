import { describe, it, expect } from "vitest";
import { timeRangesOverlap } from "./utils";

describe("timeRangesOverlap", () => {
  it("returns true for identical ranges", () => {
    expect(timeRangesOverlap("10:00", "11:00", "10:00", "11:00")).toBe(true);
  });

  it("returns true when range A starts inside range B", () => {
    expect(timeRangesOverlap("10:30", "11:30", "10:00", "11:00")).toBe(true);
  });

  it("returns true when range A ends inside range B", () => {
    expect(timeRangesOverlap("09:30", "10:30", "10:00", "11:00")).toBe(true);
  });

  it("returns true when range A fully contains range B", () => {
    expect(timeRangesOverlap("09:00", "12:00", "10:00", "11:00")).toBe(true);
  });

  it("returns true when range A is fully contained in range B", () => {
    expect(timeRangesOverlap("10:15", "10:45", "10:00", "11:00")).toBe(true);
  });

  it("returns false for back-to-back ranges (A ends exactly when B starts)", () => {
    expect(timeRangesOverlap("09:00", "10:00", "10:00", "11:00")).toBe(false);
  });

  it("returns false for back-to-back ranges (A starts exactly when B ends)", () => {
    expect(timeRangesOverlap("11:00", "12:00", "10:00", "11:00")).toBe(false);
  });

  it("returns false for disjoint ranges", () => {
    expect(timeRangesOverlap("13:00", "14:00", "10:00", "11:00")).toBe(false);
  });
});
