import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

export default function Layout() {
  return (
    <main className="bg-base-300">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
}
