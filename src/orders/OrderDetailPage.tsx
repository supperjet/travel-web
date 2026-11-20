import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { formatMoney } from "../catalog/format";
import { ErrorState, LoadingState } from "../components/AsyncState";
import { FormError } from "../components/FormError";
import { cancelOrder, getOrder } from "./api";
import { orderCountdown, orderRefreshInterval } from "./order-countdown";
import { statusText } from "./OrderListPage";

export function OrderDetailPage() {
  const { orderId = "" } = useParams();
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());
  const orderQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
    refetchInterval: (query) => orderRefreshInterval(query.state.data?.order.status),
  });
  const cancellation = useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: (result) => {
      queryClient.setQueryData(["orders", orderId], result);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  const pendingOrder = orderQuery.data?.order.status === "PENDING_PAYMENT" ? orderQuery.data.order : null;

  useEffect(() => {
    if (!pendingOrder) return;
    const updateClock = () => setNow(Date.now());
    updateClock();
    const clock = window.setInterval(updateClock, 1_000);
    const remainingMs = Math.max(0, Date.parse(pendingOrder.paymentDueAt) - Date.now());
    const expiryRefresh = window.setTimeout(() => {
      updateClock();
      void orderQuery.refetch();
    }, remainingMs + 50);
    return () => {
      window.clearInterval(clock);
      window.clearTimeout(expiryRefresh);
    };
  }, [pendingOrder?.id, pendingOrder?.paymentDueAt, orderQuery.refetch]);

  if (orderQuery.isLoading) return <LoadingState>正在读取订单…</LoadingState>;
  if (orderQuery.isError || !orderQuery.data) return <ErrorState error={orderQuery.error} retry={() => void orderQuery.refetch()} />;
  const order = orderQuery.data.order;
  const countdown = orderCountdown(order.paymentDueAt, new Date(now));
  return <div className="trip-page order-page">
    <header className="trip-head"><div><p className="eyebrow">{order.orderNumber}</p><h1>订单详情</h1><p>订单内容已经冻结，当前不会发起支付。</p></div><span className="status-pill">{statusText[order.status]}</span></header>
    <div className="trip-layout"><div className="trip-items">{order.items.map((item, index) => <article className="trip-item" key={item.id}>
      <span className="trip-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="trip-item-copy"><p className="card-label">{item.type}</p><h2>{item.title}</h2><span>计费数量 {item.billingQuantity}</span></div>
      <div className="trip-price"><span>服务端计价</span><strong>{formatMoney(item.lineTotalAmount, item.currency)}</strong></div>
    </article>)}</div>
    <aside className="trip-summary"><p className="card-label">ORDER TOTAL</p><h2>{formatMoney(order.totalAmount, order.currency)}</h2>{order.status === "PENDING_PAYMENT" && <div className={`order-countdown ${countdown.expired ? "expired" : ""}`}><span>{countdown.expired ? "支付窗口已结束" : "自动取消倒计时"}</span><strong>{countdown.expired ? "等待系统更新状态…" : countdown.label}</strong></div>}<p>支付截止时间：{new Date(order.paymentDueAt).toLocaleString()}</p><div><span>支付状态</span><strong>{order.payment.status}</strong></div><FormError error={cancellation.error} />{order.status === "PENDING_PAYMENT" && <button className="button button-dark button-block" type="button" disabled={cancellation.isPending} onClick={() => cancellation.mutate()}>{cancellation.isPending ? "正在取消…" : "取消订单"}</button>}<Link className="text-link order-back" to="/orders">返回订单列表</Link></aside></div>
  </div>;
}
