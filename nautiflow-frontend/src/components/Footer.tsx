import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10 mt-auto">
      <nav className="grid grid-flow-col gap-4">
        <Link to="/boat-register" className="link link-hover">
          Lancheros
        </Link>
        <Link to="/admin-panel" className="link link-hover">
          Administración
        </Link>
      </nav>

      <aside>
        <p className="text-sm">
          Copyright © {new Date().getFullYear()} NautiFlow - Todos los derechos
          reservados
        </p>
      </aside>
    </footer>
  );
}
