import { useQuery } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { listHotels } from "../catalog/api";
import { formatMoney } from "../catalog/format";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";

export function HotelListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const countryCode = searchParams.get("countryCode") ?? "";
  const hotels = useQuery({
    queryKey: ["hotels", { city, countryCode }],
    queryFn: () => listHotels({ city: city || undefined, countryCode: countryCode || undefined }),
  });

  const handleFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const nextCity = String(data.get("city") ?? "").trim();
    const nextCountry = String(data.get("countryCode") ?? "").trim().toUpperCase();
    if (nextCity) next.set("city", nextCity);
    if (nextCountry) next.set("countryCode", nextCountry);
    setSearchParams(next);
  };

  return (
    <div className="catalog-page">
      <header className="catalog-hero hotel-catalog-hero">
        <div><p className="eyebrow">PLACES TO STAY</p><h1>住进一座城市的<br />日常节奏。</h1></div>
        <form className="catalog-filter" onSubmit={handleFilter}>
          <label>城市<input name="city" defaultValue={city} placeholder="例如 Shanghai" /></label>
          <label>国家/地区<input name="countryCode" defaultValue={countryCode} placeholder="CN" maxLength={2} /></label>
          <button className="button button-accent" type="submit">查找酒店</button>
        </form>
      </header>

      <section className="catalog-content">
        <div className="result-heading"><div><p className="eyebrow">CURATED STAYS</p><h2>精选酒店</h2></div><span>{hotels.data?.pagination.total ?? 0} 个结果</span></div>
        {hotels.isLoading && <LoadingState>正在查找酒店…</LoadingState>}
        {hotels.isError && <ErrorState error={hotels.error} retry={() => void hotels.refetch()} />}
        {hotels.data?.data.length === 0 && <EmptyState>没有找到符合条件的酒店</EmptyState>}
        <div className="hotel-grid">
          {hotels.data?.data.map((hotel, index) => (
            <Link className="hotel-tile" to={`/hotels/${hotel.id}`} key={hotel.id}>
              <div className="catalog-image-wrap">
                {hotel.coverImageUrl ? <img src={hotel.coverImageUrl} alt={hotel.name} /> : <div className="image-placeholder">LL</div>}
                <span className="tile-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="tile-copy">
                <div><p>{hotel.city}{hotel.region ? ` · ${hotel.region}` : ""}</p><h3>{hotel.name}</h3></div>
                <div className="tile-meta"><span>{hotel.starRating ? `${hotel.starRating} ★` : "LOCAL PICK"}</span><strong>{hotel.fromPrice ? `${formatMoney(hotel.fromPrice.amount, hotel.fromPrice.currency)} 起` : "查看房价"}</strong></div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
