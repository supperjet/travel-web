import { describe, expect, it } from "vitest";

import { orderCountdown, orderRefreshInterval } from "./order-countdown";

describe("order countdown", () => {
  it("formats the remaining payment window", () => {
    const now = new Date("2026-11-20T10:00:00.000Z");
    const dueAt = new Date(now.getTime() + 125_000).toISOString();

    expect(orderCountdown(dueAt, now)).toEqual({ expired: false, label: "02:05", remainingMs: 125_000 });
  });

  it("clamps an elapsed payment window to zero", () => {
    const now = new Date("2026-11-20T10:00:01.000Z");
    expect(orderCountdown("2026-11-20T10:00:00.000Z", now)).toEqual({
      expired: true,
      label: "00:00",
      remainingMs: 0,
    });
  });

  it("polls only while the order is pending payment", () => {
    expect(orderRefreshInterval("PENDING_PAYMENT")).toBe(5_000);
    expect(orderRefreshInterval("CANCELLED")).toBe(false);
    expect(orderRefreshInterval("CONFIRMED")).toBe(false);
  });
});
