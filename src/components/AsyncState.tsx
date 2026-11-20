import type { ReactNode } from "react";

export function LoadingState({ children = "正在加载…" }: { children?: ReactNode }) {
  return <div className="catalog-state"><span className="loading-dot" />{children}</div>;
}

export function ErrorState({ retry }: { retry?: () => void }) {
  return <div className="catalog-state error-state"><strong>暂时无法读取服务目录</strong><span>请确认 API 正在运行后重试。</span>{retry && <button className="button button-ghost button-small" type="button" onClick={retry}>重新加载</button>}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="catalog-state"><strong>{children}</strong><span>尝试调整筛选条件。</span></div>;
}
