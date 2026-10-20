import { Link } from "react-router-dom";

export default function NotFound() {
  return (

      <div
        className="hero min-h-screen mt-16"
        style={{
          backgroundImage:
            "url(https://img.magnific.com/free-photo/shot-abandoned-broken-boat-left-by-riverbank-surrounded-by-wheat-field_181624-25337.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-6xl font-bold text-white">404</h1>
            <h2 className="mb-5 text-5xl font-semibold text-white">Not Found</h2>
            <button className="btn btn-primary bg-tertiary">
                <Link to="/"> Explorar lanchas</Link>
            </button>
          </div>
        </div>
      </div>

  );
}
