import { describe, expect, it, vi } from "vitest";

import { getCompanionAvailability, listCompanions, listHotels } from "./api";
import { formatMoney } from "./format";

describe("catalog API", () => {
  it("encodes hotel filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: [], pagination: { page: 1, limit: 20, total: 0 } }));
    await listHotels({ city: "Hong Kong", countryCode: "HK" });
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/v1/hotels?city=Hong+Kong&countryCode=HK&limit=20");
  });

  it("encodes companion filters and availability selection", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ data: [], pagination: { page: 1, limit: 20, total: 0 } }));
    await listCompanions({ language: "Mandarin", serviceArea: "Shanghai" });
    await getCompanionAvailability("companion-1", "service-1", "2026-12-01");
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/v1/companions?language=Mandarin&serviceArea=Shanghai&limit=20");
    expect(fetchMock.mock.calls[1]?.[0]).toBe("/v1/companions/companion-1/availability?serviceId=service-1&date=2026-12-01");
  });

  it("formats minor currency units", () => {
    expect(formatMoney("300000", "CNY")).toContain("3,000");
    expect(formatMoney("3000", "JPY")).toContain("3,000");
  });
});
