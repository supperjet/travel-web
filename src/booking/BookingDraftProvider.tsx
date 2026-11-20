import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BookingDraftItem = HotelDraftItem | CompanionDraftItem;

export interface HotelDraftItem {
  key: string;
  type: "HOTEL";
  hotelName: string;
  roomTypeName: string;
  ratePlanName: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  roomCount: number;
  guestCount: number;
  unitAmount: string;
  currency: string;
  priceUnit: "PER_ROOM_NIGHT" | "PER_STAY";
}

export interface CompanionDraftItem {
  key: string;
  type: "COMPANION";
  companionName: string;
  serviceName: string;
  serviceId: string;
  date: string;
  availabilityIds: string[];
  startsAt: string;
  endsAt: string;
  timezone: string;
  estimatedAmount: string;
  currency: string;
}

interface BookingDraftContextValue {
  items: BookingDraftItem[];
  addItem(item: BookingDraftItem): void;
  removeItem(key: string): void;
  clear(): void;
}

const storageKey = "localloop.booking-draft.v2";
const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

function readInitialItems(): BookingDraftItem[] {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as BookingDraftItem[] : [];
  } catch {
    return [];
  }
}

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BookingDraftItem[]>(readInitialItems);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); }, [items]);

  const value = useMemo<BookingDraftContextValue>(() => ({
    items,
    addItem: (item) => setItems((current) => [...current.filter((existing) => existing.key !== item.key), item]),
    removeItem: (key) => setItems((current) => current.filter((item) => item.key !== key)),
    clear: () => setItems([]),
  }), [items]);

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const value = useContext(BookingDraftContext);
  if (!value) throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  return value;
}
