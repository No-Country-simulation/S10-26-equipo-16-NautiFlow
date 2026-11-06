import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminPanel from "../pages/AdminPanel";
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
        <Route path="/admin-panel" element={<AdminPanel/>} />
        <Route path="/all-services" element={<AllServices />} />
        <Route path="/review-trip/:token" element={<Review />} />
        <Route path="/boat-history" element={<BoatHistory />} />
        <Route path="/boat-register" element={<BoatRegister/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </main>
  );
}
