import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { BookingDraftProvider, useBookingDraft } from "./BookingDraftProvider";

const wrapper = ({ children }: { children: ReactNode }) => <BookingDraftProvider>{children}</BookingDraftProvider>;

describe("booking draft", () => {
  beforeEach(() => localStorage.clear());

  it("adds, replaces and removes selections", () => {
    const { result } = renderHook(() => useBookingDraft(), { wrapper });
    const item = {
      key: "hotel-rate-1", type: "HOTEL" as const, hotelName: "Loop Hotel", roomTypeName: "King",
      ratePlanName: "Flexible", ratePlanId: "rate-1", checkIn: "2026-12-01", checkOut: "2026-12-03",
      roomCount: 1, guestCount: 2, unitAmount: "300000", currency: "CNY", priceUnit: "PER_ROOM_NIGHT" as const,
    };
    act(() => result.current.addItem(item));
    act(() => result.current.addItem({ ...item, guestCount: 1 }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ guestCount: 1 });
    act(() => result.current.removeItem(item.key));
    expect(result.current.items).toEqual([]);
  });
});
