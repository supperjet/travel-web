import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { beginGoogleSignIn, getAuthProviders } from "../auth/api";
import { FormError } from "../components/FormError";

export function LoginPage() {
  const { identity, login } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? "/account";
  const providersQuery = useQuery({
    queryKey: ["auth", "providers"],
    queryFn: getAuthProviders,
    staleTime: 5 * 60_000,
  });

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

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    const callbackPath = destination.startsWith("/") && !destination.startsWith("//")
      ? destination
      : "/account";

    try {
      const authorizationURL = await beginGoogleSignIn(`${window.location.origin}${callbackPath}`);
      window.location.assign(authorizationURL);
    } catch (cause) {
      setError(cause);
      setIsGoogleSubmitting(false);
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
          <p className="form-intro">使用注册邮箱，或通过已绑定的 Google 账户继续。</p>
          <FormError error={error} />
          <button
            className="button button-google button-block"
            type="button"
            disabled={!providersQuery.data?.google || isGoogleSubmitting || isSubmitting}
            onClick={handleGoogleSignIn}
          >
            <span className="google-mark" aria-hidden="true">G</span>
            {isGoogleSubmitting
              ? "正在前往 Google…"
              : providersQuery.data?.google
                ? "使用 Google 登录"
                : "Google 登录暂未配置"}
          </button>
          <div className="auth-divider"><span>或使用邮箱</span></div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
            <label>密码<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>
            <button className="button button-dark button-block" type="submit" disabled={isSubmitting || isGoogleSubmitting}>
              {isSubmitting ? "正在登录…" : "登录"}
            </button>
          </form>
          <p className="form-switch">还没有账户？<Link to="/register">立即注册</Link></p>
        </div>
      </section>
    </div>
  );
}
