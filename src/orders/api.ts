import { apiRequest } from "../api/client";
import type { CreateOrderInput, Order, OrderSummary } from "./types";

export function createOrder(input: CreateOrderInput, idempotencyKey: string) {
  return apiRequest<{ order: Order; replayed: boolean }>("/v1/orders", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(input),
  });
}

export function listOrders(page = 1, limit = 20) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiRequest<{ data: OrderSummary[]; pagination: { page: number; limit: number; total: number } }>(`/v1/orders?${query}`);
}

export function getOrder(orderId: string) {
  return apiRequest<{ order: Order }>(`/v1/orders/${orderId}`);
}

export function cancelOrder(orderId: string) {
  return apiRequest<{ order: Order }>(`/v1/orders/${orderId}/cancel`, { method: "POST" });
}
