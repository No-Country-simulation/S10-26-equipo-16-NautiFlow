import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AdminLogin from "../pages/AdminLogin";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import NotFound from "./NotFound";
import BoatRegister from "../pages/BoatRegister";
import AllServices from "../pages/AllServices";
import BoatHistory from "../pages/BoatHistory";
import Review from "../pages/Review";

export default function Layout() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<ProtectedAdminRoute />} />
        <Route path="/all-services" element={<AllServices />} />
        <Route path="/review-trip/:token" element={<Review />} />
        <Route path="/boat-history" element={<BoatHistory />} />
        <Route path="/boat-register" element={<BoatRegister/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </main>
  );
}
