import { describe, expect, it, vi } from "vitest";

import { createOrder } from "./api";

describe("orders API", () => {
  it("creates an order with a reusable idempotency key", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({
      order: { id: "90000000-0000-4000-8000-000000000001" },
      replayed: false,
    }, { status: 201 }));
    const input = { items: [{
      type: "HOTEL" as const,
      ratePlanId: "40000000-0000-4000-8000-000000000001",
      checkIn: "2026-12-01",
      checkOut: "2026-12-03",
      roomCount: 1,
      guestCount: 2,
    }] };

    await createOrder(input, "checkout-attempt-001");

    expect(fetchMock).toHaveBeenCalledWith("/v1/orders", expect.objectContaining({
      method: "POST",
      body: JSON.stringify(input),
    }));
    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
    expect(headers.get("Idempotency-Key")).toBe("checkout-attempt-001");
  });
});
