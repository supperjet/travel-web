import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CompanionListPage } from "../companions/CompanionListPage";
import { HotelListPage } from "../hotels/HotelListPage";
import { listCompanions, listHotels } from "./api";

vi.mock("./api", () => ({ listHotels: vi.fn(), listCompanions: vi.fn() }));

function renderPage(page: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter>{page}</MemoryRouter></QueryClientProvider>);
}

describe("catalog pages", () => {
  it("renders hotel results from the API", async () => {
    vi.mocked(listHotels).mockResolvedValue({
      data: [{ id: "hotel-1", slug: "loop-hotel", name: "Loop Hotel", shortDescription: null, city: "Shanghai", region: null, countryCode: "CN", starRating: 4.5, coverImageUrl: null, fromPrice: { amount: "300000", currency: "CNY" } }],
      pagination: { page: 1, limit: 20, total: 1 },
    });
    renderPage(<HotelListPage />);
    expect(await screen.findByRole("heading", { name: "Loop Hotel" })).toBeInTheDocument();
    expect(screen.getByText(/3,000/)).toBeInTheDocument();
  });

  it("renders companion results from the API", async () => {
    vi.mocked(listCompanions).mockResolvedValue({
      data: [{ id: "companion-1", slug: "mei", displayName: "Mei Lin", portraitUrl: "https://images.example.com/mei.jpg", ratings: { sights: 9, food: 8, nightlife: 7 } }],
      pagination: { page: 1, limit: 20, total: 1 },
    });
    renderPage(<CompanionListPage />);
    expect(await screen.findByRole("heading", { name: "Mei Lin" })).toBeInTheDocument();
    expect(screen.getByText("景点 9")).toBeInTheDocument();
  });
});
