export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">Lancheros</a>
        <a className="link link-hover">Administracion</a>
      </nav>

      <aside>
        <h3>
          Copyright © {new Date().getFullYear()} - Nautiflow
        </h3>
      </aside>
    </footer>
  );
}
