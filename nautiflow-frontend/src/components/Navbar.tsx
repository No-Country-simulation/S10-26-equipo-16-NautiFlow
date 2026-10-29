import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle lg:hidden"
      />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar fixed top-0 left-0 z-50 w-full bg-base-200">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <h3 className="mx-2 flex-1 px-2 text">
            Nautiflow
          </h3>

          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              <li><Link to="/">Explorar lanchas</Link></li>
              <li><a href="/boat-register">Soy lanchero</a></li>
            </ul>
          </div>
          
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <ul className="menu min-h-full w-80 bg-base-200 p-4 pt-20">
          <li><Link to="/">Explorar lanchas</Link></li>
         <li><a href="/boat-register">Soy lanchero</a></li>
        </ul>

      </div>
    </div>
  );
}