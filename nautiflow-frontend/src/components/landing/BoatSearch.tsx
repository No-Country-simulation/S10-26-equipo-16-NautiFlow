
import { useState, type FormEvent } from "react";
import { MapPin, Search, Star, X } from "lucide-react";

export interface BoatSearchFilters {
  search: string;
  zone: string;
  rating: number;
}

interface BoatSearchProps {
  onSearch: (filters: BoatSearchFilters) => void;
  zones?: string[];
  loading?: boolean;
}

const DEFAULT_ZONES = [
  "Cancún",
  "Isla Mujeres",
  "Cozumel",
];

export default function BoatSearch({
  onSearch,
  zones = DEFAULT_ZONES,
  loading = false,
}: BoatSearchProps) {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch({
      search: search.trim(),
      zone,
      rating,
    });
  };

  const handleClear = () => {
    setSearch("");
    setZone("");
    setRating(0);

    onSearch({
      search: "",
      zone: "",
      rating: 0,
    });
  };

  return (
    <section
      aria-label="Buscar embarcaciones"
      className="relative z-10 mx-auto w-full max-w-6xl px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-xl sm:p-5 lg:grid-cols-[1fr_1fr_1.3fr_auto] lg:items-center lg:gap-0"
      >
        {/* Zona */}
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-base-300 px-3 py-2.5 lg:rounded-none lg:border-0 lg:border-r lg:px-4">
          <MapPin
            aria-hidden="true"
            className="shrink-0 text-primary"
            size={21}
          />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="boat-zone"
              className="mb-1 block text-sm font-semibold text-base-content"
            >
              ¿A dónde quieres ir?
            </label>

            <select
              id="boat-zone"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              className="select select-ghost h-auto min-h-0 w-full px-0 py-0 text-sm focus:outline-none"
            >
              <option value="">Todas las zonas</option>

              {zones.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calificación */}
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-base-300 px-3 py-2.5 lg:rounded-none lg:border-0 lg:border-r lg:px-4">
          <Star
            aria-hidden="true"
            className="shrink-0 text-amber-500"
            size={21}
          />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="boat-rating"
              className="mb-1 block text-sm font-semibold text-base-content"
            >
              Calificación
            </label>

            <select
              id="boat-rating"
              value={rating}
              onChange={(event) =>
                setRating(Number(event.target.value))
              }
              className="select select-ghost h-auto min-h-0 w-full px-0 py-0 text-sm focus:outline-none"
            >
              <option value={0}>Todas </option>
              <option value={4.8}>4.8 estrellas o más</option>
              <option value={4.9}>4.9 estrellas o más</option>
            </select>
          </div>
        </div>

        {/* Texto de búsqueda */}
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-base-300 px-3 py-2.5 lg:rounded-none lg:border-0 lg:px-4">
          <Search
            aria-hidden="true"
            className="shrink-0 text-primary"
            size={21}
          />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="boat-search"
              className="mb-1 block text-sm font-semibold text-base-content"
            >
              Encuentra tu lancha
            </label>

            <input
              id="boat-search"
              type="search"
              placeholder="Nombre o lanchero"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input input-ghost h-auto min-h-0 w-full px-0 py-0 text-sm focus:outline-none"
            />
            
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 sm:flex-row lg:ml-3 lg:flex-col xl:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary min-h-12 flex-1 gap-2 rounded-xl px-5"
          >
            <Search size={17} />
            {loading ? "Buscando..." : "Buscar lanchas"}
          </button>

                <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="btn btn-ghost btn-xs gap-1"
            aria-label="Limpiar filtros"
          >
            <X size={15} />
            Limpiar filtros
          </button>
        </div>
        
      </form>

    </section>
  );
}