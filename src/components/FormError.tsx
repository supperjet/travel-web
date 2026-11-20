import { ApiError } from "../api/client";

export function FormError({ error }: { error: unknown }) {
  if (!error) return null;
  const message = error instanceof ApiError ? error.message : "暂时无法完成请求，请稍后再试。";
  return <div className="form-error" role="alert">{message}</div>;
}
