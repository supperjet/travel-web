import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { formatMoney, formatHour } from "../catalog/format";
import { FormError } from "../components/FormError";
import { createOrder } from "../orders/api";
import { checkoutIdempotencyKey, clearCheckoutAttempt } from "../orders/idempotency";
import type { CreateOrderInput } from "../orders/types";
import { useBookingDraft, type HotelDraftItem } from "./BookingDraftProvider";

function hotelEstimate(item: HotelDraftItem): string {
  if (item.priceUnit === "PER_STAY") return item.unitAmount;
  const nights = Math.max(1, Math.round((Date.parse(item.checkOut) - Date.parse(item.checkIn)) / 86_400_000));
  return (BigInt(item.unitAmount) * BigInt(nights) * BigInt(item.roomCount)).toString();
}

export function TripDraftPage() {
  const { items, removeItem, clear } = useBookingDraft();
  const { identity } = useAuth();
  const navigate = useNavigate();
  const orderInput: CreateOrderInput = {
    items: items.map((item) => item.type === "HOTEL" ? {
      type: item.type,
      ratePlanId: item.ratePlanId,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      roomCount: item.roomCount,
      guestCount: item.guestCount,
    } : {
      type: item.type,
      serviceId: item.serviceId,
      availabilityIds: item.availabilityIds,
    }),
  };
  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(orderInput, checkoutIdempotencyKey(orderInput.items)),
    onSuccess: ({ order }) => {
      clearCheckoutAttempt();
      clear();
      navigate(`/orders/${order.id}`);
    },
  });

  return (
    <div className="trip-page">
      <header className="trip-head"><div><p className="eyebrow">YOUR TRIP DRAFT</p><h1>你的行程选择</h1><p>价格将在创建订单时由服务端重新计算，这里显示当前目录估价。</p></div>{items.length > 0 && <button className="button button-ghost button-small" type="button" onClick={clear}>清空</button>}</header>
      {items.length === 0 ? (
        <div className="empty-trip"><span>0</span><h2>行程还是空的</h2><p>从酒店或地陪目录中加入想要的服务。</p><div><Link className="button button-dark" to="/hotels">浏览酒店</Link><Link className="button button-ghost" to="/companions">寻找地陪</Link></div></div>
      ) : (
        <div className="trip-layout">
          <div className="trip-items">
            {items.map((item, index) => (
              <article className="trip-item" key={item.key}>
                <span className="trip-index">{String(index + 1).padStart(2, "0")}</span>
                {item.type === "HOTEL" ? <div className="trip-item-copy"><p className="card-label">HOTEL</p><h2>{item.hotelName}</h2><strong>{item.roomTypeName} · {item.ratePlanName}</strong><span>{item.checkIn} → {item.checkOut} · {item.roomCount} 间 · {item.guestCount} 人</span></div> : <div className="trip-item-copy"><p className="card-label">COMPANION</p><h2>{item.companionName}</h2><strong>{item.serviceName}</strong><span>{item.date} · {formatHour(item.startsAt, item.timezone)} – {formatHour(item.endsAt, item.timezone)} · {item.availabilityIds.length} 小时</span></div>}
                <div className="trip-price"><span>目录估价</span><strong>{formatMoney(item.type === "HOTEL" ? hotelEstimate(item) : item.estimatedAmount, item.currency)}</strong><button type="button" onClick={() => removeItem(item.key)}>移除</button></div>
              </article>
            ))}
          </div>
          <aside className="trip-summary"><p className="card-label">NEXT STEP</p><h2>确认订单</h2><p>创建订单前，你仍可以返回目录调整服务内容。订单创建后内容和金额将不可修改。</p><div><span>服务数量</span><strong>{items.length}</strong></div><FormError error={createOrderMutation.error} />{identity ? <button className="button button-dark button-block" type="button" disabled={createOrderMutation.isPending} onClick={() => createOrderMutation.mutate()}>{createOrderMutation.isPending ? "正在创建…" : "创建订单"}</button> : <Link className="button button-dark button-block" to="/login" state={{ from: "/trip" }}>登录后继续</Link>}<small>当前阶段不会发起支付，订单将在 20 分钟后自动取消。</small></aside>
        </div>
      )}
    </div>
  );
}
