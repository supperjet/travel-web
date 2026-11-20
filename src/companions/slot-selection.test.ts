import { describe, expect, it } from "vitest";

import { nextConsecutiveSelection } from "./slot-selection";

const slots = [
  { id: "10", startsAt: "2026-12-01T10:00:00Z", endsAt: "2026-12-01T11:00:00Z" },
  { id: "11", startsAt: "2026-12-01T11:00:00Z", endsAt: "2026-12-01T12:00:00Z" },
  { id: "13", startsAt: "2026-12-01T13:00:00Z", endsAt: "2026-12-01T14:00:00Z" },
];

describe("companion slot selection", () => {
  it("extends a selection with a consecutive hour", () => {
    expect(nextConsecutiveSelection(slots, ["10"], "11")).toEqual(["10", "11"]);
  });

  it("starts a new selection across an unavailable time gap", () => {
    expect(nextConsecutiveSelection(slots, ["10", "11"], "13")).toEqual(["13"]);
  });

  it("clears when a selected hour is clicked", () => {
    expect(nextConsecutiveSelection(slots, ["10", "11"], "10")).toEqual([]);
  });
});
