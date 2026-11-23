import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { useBookingDraft } from "../booking/BookingDraftProvider";

export function AppShell() {
  const { identity, logout } = useAuth();
  const { items } = useBookingDraft();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutFailed(false);
    try {
      await logout();
      navigate("/");
    } catch {
      setLogoutFailed(true);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="LocalLoop 首页">
          <span className="brand-mark" aria-hidden="true">L</span>
          <span>LocalLoop</span>
        </Link>
        <nav className="main-nav" aria-label="主导航">
          <NavLink to="/" end>探索</NavLink>
          <NavLink to="/hotels">酒店</NavLink>
          <NavLink to="/companions">地陪</NavLink>
          {identity && <NavLink to="/orders">订单</NavLink>}
          {identity && <NavLink to="/account">我的账户</NavLink>}
        </nav>
        <div className="header-actions">
          <Link className="trip-link" to="/trip">行程 <span>{items.length}</span></Link>
          {identity ? (
            <>
              <span className="welcome-name">Hi, {identity.user.profile.firstName}</span>
              {logoutFailed && <span className="header-auth-error" role="alert">退出失败，请重试</span>}
              <button className="button button-ghost button-small" type="button" disabled={isLoggingOut} onClick={handleLogout}>
                {isLoggingOut ? "正在退出…" : "退出"}
              </button>
            </>
          ) : (
            <>
              <Link className="text-link" to="/login">登录</Link>
              <Link className="button button-dark button-small" to="/register">创建账户</Link>
            </>
          )}
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <span>LocalLoop</span>
        <span>Travel deeper. Arrive local.</span>
      </footer>
    </div>
  );
}
