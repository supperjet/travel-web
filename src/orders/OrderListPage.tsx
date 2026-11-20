import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { formatMoney } from "../catalog/format";
import { EmptyState, ErrorState, LoadingState } from "../components/AsyncState";
import { listOrders } from "./api";

const statusText = {
  PENDING_PAYMENT: "待支付",
  PAID_PENDING_CONFIRMATION: "已支付，待确认",
  CONFIRMED: "已确认",
  REFUND_PENDING: "退款处理中",
  REFUNDED: "已退款",
  COMPLETED: "已完成",
  CANCELLED: "已取消",
  DISPUTED: "争议处理中",
} as const;

export function OrderListPage() {
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => listOrders() });
  return <div className="trip-page order-page">
    <header className="trip-head"><div><p className="eyebrow">MY ORDERS</p><h1>我的订单</h1><p>这里显示服务端保存的订单状态和金额快照。</p></div></header>
    {orders.isLoading && <LoadingState>正在读取订单…</LoadingState>}
    {orders.isError && <ErrorState error={orders.error} retry={() => void orders.refetch()} />}
    {orders.data?.data.length === 0 && <EmptyState>还没有订单</EmptyState>}
    <div className="trip-items order-list">{orders.data?.data.map((order) => <Link className="trip-item order-row" to={`/orders/${order.id}`} key={order.id}>
      <span className="status-pill">{statusText[order.status]}</span>
      <div className="trip-item-copy"><p className="card-label">{order.orderNumber}</p><h2>{order.itemCount} 项服务</h2><span>{new Date(order.createdAt).toLocaleString()}</span></div>
      <div className="trip-price"><span>订单金额</span><strong>{formatMoney(order.totalAmount, order.currency)}</strong></div>
    </Link>)}</div>
  </div>;
}

export { statusText };
