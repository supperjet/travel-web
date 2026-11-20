import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useBookingDraft } from "../booking/BookingDraftProvider";
import { getCompanion, getCompanionAvailability } from "../catalog/api";
import { formatHour, formatMoney, isoDateAfter } from "../catalog/format";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { nextConsecutiveSelection } from "./slot-selection";

export function CompanionDetailPage() {
  const { companionId = "" } = useParams();
  const { addItem } = useBookingDraft();
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(isoDateAfter(2));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const companion = useQuery({ queryKey: ["companion", companionId], queryFn: () => getCompanion(companionId), enabled: Boolean(companionId) });

  useEffect(() => {
    if (!serviceId && companion.data?.services[0]) setServiceId(companion.data.services[0].id);
  }, [companion.data, serviceId]);

  const availability = useQuery({
    queryKey: ["companion", companionId, "availability", serviceId, date],
    queryFn: () => getCompanionAvailability(companionId, serviceId, date),
    enabled: Boolean(companionId && serviceId && date),
  });

  const selectedSlots = useMemo(() => availability.data?.slots.filter((slot) => selectedIds.includes(slot.id)) ?? [], [availability.data, selectedIds]);
  const estimatedAmount = selectedSlots.reduce((total, slot) => total + BigInt(slot.hourlyPriceAmount), 0n).toString();

  const toggleSlot = (slotId: string) => {
    setAdded(false);
    const slots = availability.data?.slots ?? [];
    setSelectedIds(nextConsecutiveSelection(slots, selectedIds, slotId));
  };

  if (companion.isLoading) return <LoadingState>正在准备地陪档案…</LoadingState>;
  if (companion.isError || !companion.data) return <ErrorState retry={() => void companion.refetch()} />;

  const service = companion.data.services.find((item) => item.id === serviceId);
  const addSelection = () => {
    if (!service || !availability.data || selectedSlots.length === 0) return;
    addItem({
      key: `companion:${service.id}:${date}`,
      type: "COMPANION",
      companionName: companion.data.displayName,
      serviceName: service.name,
      serviceId: service.id,
      date,
      availabilityIds: selectedSlots.map((slot) => slot.id),
      startsAt: selectedSlots[0]!.startsAt,
      endsAt: selectedSlots.at(-1)!.endsAt,
      timezone: availability.data.timezone,
      estimatedAmount,
      currency: availability.data.currency,
    });
    setAdded(true);
  };

  const profile = companion.data.profile;
  return (
    <div className="detail-page companion-detail-page">
      <div className="detail-breadcrumb"><Link to="/companions">地陪</Link><span>/</span><span>{companion.data.displayName}</span></div>
      <section className="companion-profile-head">
        <div className="companion-portrait"><img src={profile.portraitUrl} alt={companion.data.displayName} /></div>
        <div className="companion-intro"><p className="eyebrow">{profile.city} · LOCAL COMPANION</p><h1>{companion.data.displayName}</h1><h2>{profile.tagline}</h2><p>{profile.introduction}</p><div className="language-row">{profile.languages.map((language) => <span key={language}>{language}</span>)}</div></div>
        <div className="rating-stack"><div><strong>{profile.ratings.sights}</strong><span>景点</span></div><div><strong>{profile.ratings.food}</strong><span>美食</span></div><div><strong>{profile.ratings.nightlife}</strong><span>夜生活</span></div></div>
      </section>

      <section className="companion-facts"><div><span>服务区域</span><strong>{profile.serviceArea}</strong></div><div><span>偏好</span><strong>{profile.travelPreferences}</strong></div><div><span>美食</span><strong>{profile.cuisines.join(" · ")}</strong></div><div><span>Wellness</span><strong>{profile.wellness}</strong></div></section>

      <section className="availability-section">
        <div className="availability-head"><div><p className="eyebrow">CHOOSE YOUR TIME</p><h2>选择服务与时间</h2><p>连续点击相邻小时可延长陪同时间，最多 16 小时。</p></div><div className="availability-fields"><label>服务<select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setSelectedIds([]); setAdded(false); }}>{companion.data.services.map((item) => <option value={item.id} key={item.id}>{item.name} · {formatMoney(item.baseHourlyPriceAmount, item.currency)}/小时</option>)}</select></label><label>日期<input type="date" min={isoDateAfter(1)} max={isoDateAfter(companion.data.bookingWindowDays)} value={date} onChange={(event) => { setDate(event.target.value); setSelectedIds([]); setAdded(false); }} /></label></div></div>
        {availability.isLoading && <LoadingState>正在读取可用档期…</LoadingState>}
        {availability.isError && <ErrorState retry={() => void availability.refetch()} />}
        {availability.data && <div className="slot-grid">{availability.data.slots.map((slot) => <button className={`slot-button ${selectedIds.includes(slot.id) ? "selected" : ""}`} type="button" key={slot.id} onClick={() => toggleSlot(slot.id)}><strong>{formatHour(slot.startsAt, availability.data.timezone)}</strong><span>{formatMoney(slot.hourlyPriceAmount, availability.data.currency)}</span><small>{slot.rateBand === "STANDARD" ? "标准" : slot.rateBand === "EVENING" ? "晚间" : "深夜"}</small></button>)}</div>}
        {availability.data?.slots.length === 0 && <div className="catalog-state">当天暂无可用档期</div>}
        {selectedSlots.length > 0 && <div className="selection-bar"><div><span>{selectedSlots.length} 小时</span><strong>{formatHour(selectedSlots[0]!.startsAt, companion.data.timezone)} – {formatHour(selectedSlots.at(-1)!.endsAt, companion.data.timezone)}</strong></div><div><span>预计金额</span><strong>{formatMoney(estimatedAmount, availability.data!.currency)}</strong></div><button className="button button-dark" type="button" onClick={addSelection}>{added ? "已加入行程" : "加入行程"}</button></div>}
      </section>
    </div>
  );
}
