import type { ReactNode } from "react";

import { ApiError } from "../api/client";

export function LoadingState({ children = "正在加载…" }: { children?: ReactNode }) {
  return <div className="catalog-state"><span className="loading-dot" />{children}</div>;
}

export function ErrorState({ error, retry }: { error?: unknown; retry?: () => void }) {
  const message = error instanceof ApiError ? error.message : "请确认 API 正在运行后重试。";
  return <div className="catalog-state error-state"><strong>暂时无法读取服务目录</strong><span>{message}</span>{retry && <button className="button button-ghost button-small" type="button" onClick={retry}>重新加载</button>}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="catalog-state"><strong>{children}</strong><span>尝试调整筛选条件。</span></div>;
}
