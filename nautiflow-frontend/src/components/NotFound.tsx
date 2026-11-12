import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="hero min-h-[calc(100vh-5rem)] w-full"
      style={{
        backgroundImage:
          "url(https://img.magnific.com/free-photo/shot-abandoned-broken-boat-left-by-riverbank-surrounded-by-wheat-field_181624-25337.jpg)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
          <h2 className="mb-4 text-3xl font-semibold text-white">
            Ruta no encontrada
          </h2>
          <p className="mb-6 text-sm text-gray-200">
            Parece que esta lancha tomó un desvío equivocado y estas aguas están
            inexploradas.
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar lanchas
          </Link>
        </div>
      </div>
    </div>
  );
}
