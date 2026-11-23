import * as Dialog from "@radix-ui/react-dialog";
import { ClipboardList, Compass, Hotel, LogOut, MapPinned, Menu, Route, UserRound, UsersRound, X } from "lucide-react";
import { Suspense, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

import { useAuth } from "../auth/AuthProvider";
import { useBookingDraft } from "../booking/BookingDraftProvider";
import { LoadingState } from "./AsyncState";
import { Button, buttonVariants } from "./ui/Button";

const primaryLinks = [
  { to: "/", label: "探索", icon: Compass, end: true },
  { to: "/hotels", label: "酒店", icon: Hotel, end: false },
  { to: "/companions", label: "地陪", icon: UsersRound, end: false },
] as const;

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
          {primaryLinks.map(({ to, label, end }) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
          {identity && <NavLink to="/orders">订单</NavLink>}
          {identity && <NavLink to="/account">我的账户</NavLink>}
        </nav>
        <div className="header-actions">
          <Link className="trip-link" to="/trip"><Route size={17} aria-hidden="true" />行程 <span>{items.length}</span></Link>
          <div className="desktop-auth-actions">
          {identity ? (
            <>
              <span className="welcome-name">Hi, {identity.user.profile.firstName}</span>
              {logoutFailed && <span className="header-auth-error" role="alert">退出失败，请重试</span>}
              <Button variant="outline" size="small" type="button" disabled={isLoggingOut} onClick={handleLogout}>
                {isLoggingOut ? "正在退出…" : "退出"}
              </Button>
            </>
          ) : (
            <>
              <Link className="text-link" to="/login">登录</Link>
              <Link className={buttonVariants({ variant: "dark", size: "small" })} to="/register">创建账户</Link>
            </>
          )}
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button className="mobile-menu-trigger" variant="quiet" size="icon" aria-label="打开导航"><Menu size={21} /></Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="mobile-nav-overlay" />
              <Dialog.Content className="mobile-nav-content" aria-describedby={undefined}>
                <div className="mobile-nav-head">
                  <Dialog.Title className="brand"><span className="brand-mark" aria-hidden="true">L</span><span>LocalLoop</span></Dialog.Title>
                  <Dialog.Close asChild><Button variant="quiet" size="icon" aria-label="关闭导航"><X size={21} /></Button></Dialog.Close>
                </div>
                <nav className="mobile-nav-links" aria-label="移动导航">
                  {primaryLinks.map(({ to, label, icon: Icon, end }) => <Dialog.Close asChild key={to}><NavLink className="mobile-nav-link" to={to} end={end}><Icon size={20} />{label}</NavLink></Dialog.Close>)}
                  <Dialog.Close asChild><NavLink className="mobile-nav-link" to="/trip"><MapPinned size={20} />我的行程</NavLink></Dialog.Close>
                  {identity && <Dialog.Close asChild><NavLink className="mobile-nav-link" to="/orders"><ClipboardList size={20} />我的订单</NavLink></Dialog.Close>}
                  {identity && <Dialog.Close asChild><NavLink className="mobile-nav-link" to="/account"><UserRound size={20} />我的账户</NavLink></Dialog.Close>}
                </nav>
                <div className="mobile-nav-account">
                  {identity ? <><div className="mobile-nav-user"><strong>{identity.user.name}</strong><span>{identity.user.email}</span></div><Button variant="outline" block disabled={isLoggingOut} onClick={handleLogout}><LogOut size={17} />{isLoggingOut ? "正在退出…" : "退出登录"}</Button></> : <><Dialog.Close asChild><Link className={buttonVariants({ variant: "dark", block: true })} to="/login">登录</Link></Dialog.Close><Dialog.Close asChild><Link className={buttonVariants({ variant: "outline", block: true })} to="/register">创建账户</Link></Dialog.Close></>}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
      <main><Suspense fallback={<LoadingState>正在打开页面…</LoadingState>}><Outlet /></Suspense></main>
      <footer className="site-footer">
        <span>LocalLoop</span>
        <span>Travel deeper. Arrive local.</span>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}
