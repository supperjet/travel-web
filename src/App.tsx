import { Route, Routes } from "react-router-dom";

import { RequireAuth } from "./auth/RequireAuth";
import { TripDraftPage } from "./booking/TripDraftPage";
import { AppShell } from "./components/AppShell";
import { CompanionDetailPage } from "./companions/CompanionDetailPage";
import { CompanionListPage } from "./companions/CompanionListPage";
import { HotelDetailPage } from "./hotels/HotelDetailPage";
import { HotelListPage } from "./hotels/HotelListPage";
import { AccountPage } from "./pages/AccountPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";

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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
