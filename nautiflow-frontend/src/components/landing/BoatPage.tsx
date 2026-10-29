import { useEffect, useState } from "react";
import BoatSearch, { type BoatSearchFilters } from "./BoatSearch";
import { Star } from "lucide-react";
import { BoatOperatorService } from "../../services/BoatOperator.Service";

interface Boat {
  id: string | number;
  name: string;
  captain: string;
  zone: string;
  rating: number;
  capacity: number;
  image: string;
}

interface BoatApi {
  id?: string | number;
  nombreEmbarcacion: string;
  zonaCobertura: string;
  promedioCalificaciones: number;
  rating?: number;
  capacidad: number;
  fotosUrl?: string;
}

interface BoatOperatorApi {
  nombre: string;
  boats?: BoatApi[];
}

export default function BoatsPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [allBoats, setAllBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

void BoatOperatorService
      .getOperators()
      .then((data: BoatOperatorApi[]) => {
        if (cancelled) return;

        setError(null);
        const formattedBoats: Boat[] = [];

        data.forEach((operator: BoatOperatorApi) => {
          if (operator.boats && operator.boats.length > 0) {
            operator.boats.forEach((boat: BoatApi) => {
              formattedBoats.push({
                id: boat.id ?? `${operator.nombre}-${boat.nombreEmbarcacion}`,
                name: boat.nombreEmbarcacion,
                captain: operator.nombre,
                zone: boat.zonaCobertura,
                rating: Number(boat.promedioCalificaciones) || 0.0,
                capacity: boat.capacidad,
                image:
                  boat.fotosUrl ||
                  "https://placehold.co/600x400?text=NautiFlow",
              });
            });
          }
        });

        setBoats(formattedBoats);
        setAllBoats(formattedBoats);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        console.error("Error al cargar las lanchas:", err);
        setError("No se pudieron cargar las lanchas del servidor.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (filters: BoatSearchFilters) => {
    setHasSearched(true);

    const results = allBoats.filter((boat) => {
      const term = filters.search.toLocaleLowerCase();

      const matchesSearch =
        boat.name.toLocaleLowerCase().includes(term) ||
        boat.captain.toLocaleLowerCase().includes(term);

      const matchesZone = !filters.zone || boat.zone === filters.zone;

      const matchesRating = boat.rating >= filters.rating;

      return matchesSearch && matchesZone && matchesRating;
    });

    setBoats(results);
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

        {error && (
          <p className="mb-6 rounded-xl bg-error/10 p-4 text-center text-error">
            {error}
          </p>
        )}

        {loading ? (
          <div className="py-12 text-center text-base-content/70">
            Cargando lanchas...
          </div>
        ) : boats.length === 0 ? (
          <p className="rounded-xl bg-base-100 p-8 text-center text-base-content/70">
            No encontramos lancha registradas o con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((boat) => (
              <article
                key={boat.id}
                className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"
              >
                <figure className="aspect-3/2">
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
                      <Star
                        size={14}
                        aria-hidden="true"
                        className="fill-current"
                      />
                      {boat.rating}
                    </span>
                  </div>

                  <p className="text-sm text-base-content/70">
                    {boat.zone} · {boat.captain}
                  </p>

                  <p className="text-sm">Capacidad: {boat.capacity} personas</p>

                  <div className="card-actions mt-3">
                    <button type="button" className="btn btn-primary w-full">
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
