import { describe, expect, it } from "vitest";

import { checkoutIdempotencyKey } from "./idempotency";

describe("checkout idempotency", () => {
  it("reuses one key for the same draft and rotates it when the draft changes", () => {
    localStorage.clear();
    const firstDraft = [{ type: "HOTEL", ratePlanId: "rate-1" }];
    const first = checkoutIdempotencyKey(firstDraft);

    expect(checkoutIdempotencyKey(firstDraft)).toBe(first);
    expect(checkoutIdempotencyKey([{ type: "HOTEL", ratePlanId: "rate-2" }])).not.toBe(first);
  });
});
