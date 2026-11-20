export interface OrderCountdown {
  expired: boolean;
  label: string;
  remainingMs: number;
}

export function orderCountdown(paymentDueAt: string, now = new Date()): OrderCountdown {
  const remainingMs = Math.max(0, Date.parse(paymentDueAt) - now.getTime());
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    expired: remainingMs === 0,
    label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    remainingMs,
  };
}

export function orderRefreshInterval(status: string | undefined): 5_000 | false {
  return status === "PENDING_PAYMENT" ? 5_000 : false;
}
