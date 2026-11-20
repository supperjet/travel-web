export type OrderStatus = "PENDING_PAYMENT" | "PAID_PENDING_CONFIRMATION" | "CONFIRMED" |
  "REFUND_PENDING" | "REFUNDED" | "COMPLETED" | "CANCELLED" | "DISPUTED";

export interface OrderItem {
  id: string;
  type: "HOTEL" | "COMPANION";
  title: string;
  billingQuantity: number;
  baseUnitAmount: string;
  pricingAdjustmentAmount: string;
  serviceFeeAmount: string;
  lineTotalAmount: string;
  currency: string;
  serviceSnapshot: Record<string, unknown>;
  termsSnapshot: Record<string, unknown>;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotalAmount: string;
  serviceFeeAmount: string;
  totalAmount: string;
  paymentDueAt: string;
  items: OrderItem[];
  payment: {
    id: string;
    paymentNo: string;
    status: "UNPAID" | "PROCESSING" | "AUTHORIZED" | "CAPTURED" | "VOIDED" | "FAILED" | "REFUNDED" | "DISPUTED";
    provider: string;
    amountDue: string;
    currency: string;
  };
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  totalAmount: string;
  paymentDueAt: string;
  createdAt: string;
  itemCount: number;
}

export type CreateOrderItem = {
  type: "HOTEL";
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  roomCount: number;
  guestCount: number;
} | {
  type: "COMPANION";
  serviceId: string;
  availabilityIds: string[];
  meetingPoint?: Record<string, unknown>;
};

export interface CreateOrderInput {
  items: CreateOrderItem[];
  reorderedFromOrderId?: string;
}
