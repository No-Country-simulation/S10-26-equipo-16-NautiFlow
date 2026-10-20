import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <Link to="/boat-register" className="link link-hover">Lancheros</Link>
        <Link to="/admin-panel" className="link link-hover">Administracion</Link>
      </nav>

      <aside>
        <h3>
          Copyright © {new Date().getFullYear()} - Nautiflow
        </h3>
      </aside>
    </footer>
  );
}
