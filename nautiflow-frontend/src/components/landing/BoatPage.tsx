
import { useState } from "react";
import BoatSearch, {
  type BoatSearchFilters,
} from "./BoatSearch";

interface Boat {
  id: number;
  name: string;
  captain: string;
  zone: string;
  rating: number;
  capacity: number;
  image: string;
}

const MOCK_BOATS: Boat[] = [
  {
    id: 1,
    name: "Caribe Explorer",
    captain: "Miguel Torres",
    zone: "Cancún",
    rating: 4.9,
    capacity: 8,
    image: "https://img.magnific.com/free-photo/shot-abandoned-broken-boat-left-by-riverbank-surrounded-by-wheat-field_181624-25337.jpg",
  },
  {
    id: 2,
    name: "Isla Paradise",
    captain: "Ana Rodríguez",
    zone: "Isla Mujeres",
    rating: 4.8,
    capacity: 12,
    image: "https://placehold.co/600x400?text=Isla+Paradise",
  },
  {
    id: 3,
    name: "Cozumel Blue",
    captain: "Jorge Hernández",
    zone: "Cozumel",
    rating: 4.7,
    capacity: 6,
    image: "https://placehold.co/600x400?text=Cozumel+Blue",
  },
];

export default function BoatsPage() {
  const [boats, setBoats] = useState<Boat[]>(MOCK_BOATS);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (filters: BoatSearchFilters) => {
    setLoading(true);
    setHasSearched(true);

    // Simulación local. Reemplazar por la llamada a la API.
    const results = MOCK_BOATS.filter((boat) => {
      const term = filters.search.toLocaleLowerCase();

      const matchesSearch =
        boat.name.toLocaleLowerCase().includes(term) ||
        boat.captain.toLocaleLowerCase().includes(term);

      const matchesZone =
        !filters.zone || boat.zone === filters.zone;

      const matchesRating = boat.rating >= filters.rating;

      return matchesSearch && matchesZone && matchesRating;
    });

    setBoats(results);
    setLoading(false);
  };

  return (
    <main className="min-h-screen ">

      <div className="-mt-2">
        <BoatSearch onSearch={handleSearch} loading={loading} />
      </div>

      <section
        id="lanchas"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 py-12"
      >
        <h2 className="mb-6 text-2xl font-bold">
          {hasSearched ? "Resultados de búsqueda" : "Lanchas disponibles"}
        </h2>

        {boats.length === 0 ? (
          <p className="rounded-xl bg-base-100 p-8 text-center text-base-content/70">
            No encontramos lanchas con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((boat) => (
              <article
                key={boat.id}
                className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"
              >
                <figure className="aspect-[3/2]">
                  <img
                    src={boat.image}
                    alt={boat.name}
                    className="h-full w-full object-cover"
                  />
                </figure>

                <div className="card-body gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title">{boat.name}</h3>

                    <span className="badge badge-warning gap-1">
                      <span aria-hidden="true">★</span>
                      {boat.rating}
                    </span>
                  </div>

                  <p className="text-sm text-base-content/70">
                    {boat.zone} · {boat.captain}
                  </p>

                  <p className="text-sm">
                    Capacidad: {boat.capacity} personas
                  </p>

                  <div className="card-actions mt-3">
                    <button
                      type="button"
                      className="btn btn-primary w-full"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}