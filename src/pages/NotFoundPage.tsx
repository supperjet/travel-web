import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <div className="not-found"><p className="eyebrow">404</p><h1>这条路暂时不在行程里。</h1><Link className="button button-dark" to="/">返回首页</Link></div>;
}
