import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { FormError } from "../components/FormError";

export function LoginPage() {
  const { identity, login } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? "/account";

  if (identity) return <Navigate to={destination} replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      await login(String(data.get("email")), String(data.get("password")));
      navigate(destination, { replace: true });
    } catch (cause) {
      setError(cause);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-aside">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>继续你的<br />LocalLoop 旅程。</h1>
        <p>登录后查看个人资料，并继续浏览酒店、地陪与订单。</p>
        <div className="aside-coordinate">34.6937° N · 135.5023° E</div>
      </section>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">MEMBER SIGN IN</p>
          <h2>登录</h2>
          <p className="form-intro">使用注册邮箱继续。</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <FormError error={error} />
            <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
            <label>密码<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
            <button className="button button-dark button-block" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "正在登录…" : "登录"}
            </button>
          </form>
          <p className="form-switch">还没有账户？<Link to="/register">立即注册</Link></p>
        </div>
      </section>
    </div>
  );
}
