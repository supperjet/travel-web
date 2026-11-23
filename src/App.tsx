import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { RequireAuth } from "./auth/RequireAuth";
import { AppShell } from "./components/AppShell";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const AccountPage = lazy(() => import("./pages/AccountPage").then((module) => ({ default: module.AccountPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const HotelListPage = lazy(() => import("./hotels/HotelListPage").then((module) => ({ default: module.HotelListPage })));
const HotelDetailPage = lazy(() => import("./hotels/HotelDetailPage").then((module) => ({ default: module.HotelDetailPage })));
const CompanionListPage = lazy(() => import("./companions/CompanionListPage").then((module) => ({ default: module.CompanionListPage })));
const CompanionDetailPage = lazy(() => import("./companions/CompanionDetailPage").then((module) => ({ default: module.CompanionDetailPage })));
const TripDraftPage = lazy(() => import("./booking/TripDraftPage").then((module) => ({ default: module.TripDraftPage })));
const OrderListPage = lazy(() => import("./orders/OrderListPage").then((module) => ({ default: module.OrderListPage })));
const OrderDetailPage = lazy(() => import("./orders/OrderDetailPage").then((module) => ({ default: module.OrderDetailPage })));

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="hotels" element={<HotelListPage />} />
        <Route path="hotels/:hotelId" element={<HotelDetailPage />} />
        <Route path="companions" element={<CompanionListPage />} />
        <Route path="companions/:companionId" element={<CompanionDetailPage />} />
        <Route path="trip" element={<TripDraftPage />} />
        <Route element={<RequireAuth />}>
          <Route path="account" element={<AccountPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
