import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useBookingDraft } from "../booking/BookingDraftProvider";
import { getHotel, listHotelRoomTypes } from "../catalog/api";
import { formatMoney, isoDateAfter } from "../catalog/format";
import type { HotelRatePlan, HotelRoomType } from "../catalog/types";
import { ErrorState, LoadingState } from "../components/AsyncState";

const mealLabels: Record<HotelRatePlan["mealPlan"], string> = {
  ROOM_ONLY: "不含早餐", BREAKFAST: "含早餐", HALF_BOARD: "半膳", FULL_BOARD: "全膳", ALL_INCLUSIVE: "全包",
};

export function HotelDetailPage() {
  const { hotelId = "" } = useParams();
  const { addItem } = useBookingDraft();
  const [checkIn, setCheckIn] = useState(isoDateAfter(7));
  const [checkOut, setCheckOut] = useState(isoDateAfter(9));
  const [roomCount, setRoomCount] = useState(1);
  const [guestCount, setGuestCount] = useState(2);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const hotel = useQuery({ queryKey: ["hotel", hotelId], queryFn: () => getHotel(hotelId), enabled: Boolean(hotelId) });
  const rooms = useQuery({ queryKey: ["hotel", hotelId, "rooms"], queryFn: () => listHotelRoomTypes(hotelId), enabled: Boolean(hotelId) });

  if (hotel.isLoading || rooms.isLoading) return <LoadingState>正在准备酒店详情…</LoadingState>;
  if (hotel.isError || rooms.isError || !hotel.data || !rooms.data) return <ErrorState retry={() => { void hotel.refetch(); void rooms.refetch(); }} />;

  const selectRate = (room: HotelRoomType, rate: HotelRatePlan) => {
    const key = `hotel:${rate.id}`;
    addItem({ key, type: "HOTEL", hotelName: hotel.data.name, roomTypeName: room.name, ratePlanName: rate.name,
      ratePlanId: rate.id, checkIn, checkOut, roomCount, guestCount, unitAmount: rate.basePriceAmount,
      currency: rate.currency, priceUnit: rate.priceUnit });
    setAddedKey(key);
  };

  const heroImage = hotel.data.images.find((image) => image.role === "COVER") ?? hotel.data.images[0];

  return (
    <div className="detail-page">
      <div className="detail-breadcrumb"><Link to="/hotels">酒店</Link><span>/</span><span>{hotel.data.name}</span></div>
      <section className="hotel-detail-head">
        <div className="detail-title"><p className="eyebrow">{hotel.data.address.city} · {hotel.data.address.countryCode}</p><h1>{hotel.data.name}</h1><p>{hotel.data.shortDescription}</p></div>
        <div className="detail-rating"><strong>{hotel.data.starRating ?? "—"}</strong><span>HOTEL RATING</span></div>
      </section>
      <div className="detail-hero-image">{heroImage ? <img src={heroImage.url} alt={heroImage.altText ?? hotel.data.name} /> : <div className="image-placeholder">LocalLoop Stay</div>}</div>
      <section className="detail-overview">
        <div><p className="eyebrow">ABOUT THE STAY</p><h2>{hotel.data.description ?? hotel.data.shortDescription}</h2></div>
        <div className="amenity-list">{hotel.data.amenities.map((amenity) => <span key={amenity.code}>{amenity.name}</span>)}</div>
      </section>

      <section className="booking-section">
        <div className="booking-section-head"><div><p className="eyebrow">ROOMS & RATES</p><h2>选择你的房间</h2></div><div className="stay-fields"><label>入住<input type="date" value={checkIn} min={isoDateAfter(1)} onChange={(event) => setCheckIn(event.target.value)} /></label><label>退房<input type="date" value={checkOut} min={checkIn} onChange={(event) => setCheckOut(event.target.value)} /></label><label>房间<input type="number" value={roomCount} min={1} max={20} onChange={(event) => setRoomCount(Number(event.target.value))} /></label><label>客人<input type="number" value={guestCount} min={1} max={100} onChange={(event) => setGuestCount(Number(event.target.value))} /></label></div></div>
        <div className="room-list">
          {rooms.data.data.map((room) => (
            <article className="room-card" key={room.id}>
              <div className="room-image">{room.images[0] ? <img src={room.images[0].url} alt={room.images[0].altText ?? room.name} /> : <div className="image-placeholder">{room.category ?? "ROOM"}</div>}</div>
              <div className="room-copy"><span className="card-label">{room.category ?? "ROOM"}</span><h3>{room.name}</h3><p>{room.description}</p><div className="room-facts"><span>最多 {room.maxGuests} 人</span>{room.areaSqm && <span>{room.areaSqm} m²</span>}<span>{room.beds.map((bed) => `${bed.quantity} ${bed.type}`).join(" · ")}</span></div></div>
              <div className="rate-list">
                {room.ratePlans.map((rate) => {
                  const key = `hotel:${rate.id}`;
                  return <div className="rate-row" key={rate.id}><div><strong>{rate.name}</strong><span>{mealLabels[rate.mealPlan]} · {rate.priceUnit === "PER_ROOM_NIGHT" ? "每房晚" : "每次住宿"}</span></div><div><strong>{formatMoney(rate.basePriceAmount, rate.currency)}</strong><button className="button button-dark button-small" type="button" onClick={() => selectRate(room, rate)} disabled={guestCount > room.maxGuests * roomCount || checkOut <= checkIn}>{addedKey === key ? "已加入" : "加入行程"}</button></div></div>;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
