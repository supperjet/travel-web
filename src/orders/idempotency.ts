const storageKey = "localloop.checkout-attempt.v1";

interface CheckoutAttempt {
  fingerprint: string;
  key: string;
}

export function checkoutIdempotencyKey(items: unknown[]): string {
  const fingerprint = JSON.stringify(items);
  try {
    const stored = localStorage.getItem(storageKey);
    const attempt = stored ? JSON.parse(stored) as CheckoutAttempt : null;
    if (attempt?.fingerprint === fingerprint && attempt.key) return attempt.key;
  } catch {
    // A fresh key is safe when browser storage is unavailable or corrupt.
  }

  const key = `checkout-${crypto.randomUUID()}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify({ fingerprint, key } satisfies CheckoutAttempt));
  } catch {
    // The in-flight request still has a valid key even without persistence.
  }
  return key;
}

export function clearCheckoutAttempt(): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Clearing storage is best-effort after a successful order creation.
  }
}
