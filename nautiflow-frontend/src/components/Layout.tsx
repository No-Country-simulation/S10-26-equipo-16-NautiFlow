import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminPanel from "../pages/AdminPanel";
import NotFound from "./NotFound";
import BoatRegister from "../pages/BoatRegister";

export default function Layout() {
  return (
    <main className="bg-base-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-panel" element={<AdminPanel/>} />
        <Route path="/boat-register" element={<BoatRegister/>}/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </main>
  );
}
