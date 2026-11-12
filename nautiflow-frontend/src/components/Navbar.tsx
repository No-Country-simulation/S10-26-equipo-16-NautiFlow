import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

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
        <div className="navbar fixed top-0 left-0 z-50 w-full border-b border-base-300/70 bg-base-100/95 shadow-sm backdrop-blur-md">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Menu className="h-6 w-6" />
            </label>
          </div>

          <Link
            to="/"
            aria-label="NautiFlow, inicio"
            className="mx-2 flex-1 px-2"
          >
            <img
              src="/logo-nautiflow.png"
              alt="NautiFlow"
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>

          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal px-1">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? "bg-primary/10 font-semibold text-primary"
                        : "hover:bg-base-200 hover:text-primary"
                    }`
                  }
                >
                  Explorar lanchas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/boat-register"
                  className={({ isActive }) =>
                    `rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? "bg-primary/10 font-semibold text-primary"
                        : "hover:bg-base-200 hover:text-primary"
                    }`
                  }
                >
                  Soy lanchero
                </NavLink>
              </li>
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

        <ul className="menu min-h-full w-80 border-r border-base-300 bg-base-100 p-4 pt-20 shadow-xl">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "hover:bg-base-200 hover:text-primary"
                }`
              }
            >
              Explorar lanchas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/boat-register"
              className={({ isActive }) =>
                `rounded-xl py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "hover:bg-base-200 hover:text-primary"
                }`
              }
            >
              Soy lanchero
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
