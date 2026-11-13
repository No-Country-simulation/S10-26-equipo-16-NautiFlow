import { useEffect, useState } from "react";
import BoatSearch, { type BoatSearchFilters } from "./BoatSearch";
import { MapPin, Star, UsersRound } from "lucide-react";
import { BoatOperatorService } from "../../services/BoatOperator.Service";
import { DELTA_ZONES } from "../../constants/deltaZones";
import AskAvailabilityModal from "./AskAvailabilityModal";

interface Boat {
  id: string | number;
  name: string;
  captain: string;
  zone: string[];
  rating: number;
  capacity: number;
  image: string;
}

interface BoatApi {
  id?: string | number;
  nombreEmbarcacion: string;
  zonaCobertura: string[] | string;
  promedioCalificaciones: number;
  rating?: number;
  capacidad: number;
  fotos?: { url: string; publicId: string }[] | null;
  fotosUrl?: string | null;
  activa?: boolean;
}

interface BoatOperatorApi {
  nombre: string;
  estadoVerificacion: string;
  boats?: BoatApi[];
}

function normalizeZones(value: string[] | string): string[] {
  return Array.isArray(value)
    ? value
    : value
        .split(",")
        .map((zone) => zone.trim())
        .filter(Boolean);
}

export default function BoatsPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [allBoats, setAllBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);

  useEffect(() => {
    let cancelled = false;

    void BoatOperatorService.getOperators()
      .then((data: BoatOperatorApi[]) => {
        if (cancelled) return;

        setError(null);
        const formattedBoats: Boat[] = [];

        data.forEach((operator: BoatOperatorApi) => {
          if (operator.estadoVerificacion !== "VERIFIED") return;
          if (operator.boats && operator.boats.length > 0) {
            operator.boats.forEach((boat: BoatApi) => {
              if (boat.activa === false) return;

              formattedBoats.push({
                id: boat.id ?? `${operator.nombre}-${boat.nombreEmbarcacion}`,
                name: boat.nombreEmbarcacion,
                captain: operator.nombre,
                zone: normalizeZones(boat.zonaCobertura),
                rating: Number(boat.promedioCalificaciones) || 0.0,
                capacity: boat.capacidad,
                image:
                  boat.fotos?.find((photo) => photo.url)?.url ||
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
    const hasFilters =
      filters.search !== "" || filters.zone !== "" || filters.rating > 0;
    setHasSearched(hasFilters);

    const results = allBoats.filter((boat) => {
      const term = filters.search.toLocaleLowerCase();

      const matchesSearch =
        boat.name.toLocaleLowerCase().includes(term) ||
        boat.captain.toLocaleLowerCase().includes(term);

      const matchesZone = !filters.zone || boat.zone.includes(filters.zone);

      const matchesRating = boat.rating >= filters.rating;

      return matchesSearch && matchesZone && matchesRating;
    });

    setBoats(results);
  };

  return (
    <div className="w-full">
      <div>
        <BoatSearch
          onSearch={handleSearch}
          loading={loading}
          zones={[...DELTA_ZONES]}
        />
      </div>

      <section
        id="lanchas"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-12 pt-8 sm:pt-10"
      >
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:mb-8">
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
            No encontramos lanchas registradas o con esos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((boat) => (
              <article
                key={boat.id}
                className="card group overflow-hidden border border-base-300/80 bg-base-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none"
              >
                <figure className="aspect-[3/2] overflow-hidden bg-base-200">
                  <img
                    src={boat.image}
                    alt={boat.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </figure>

                <div className="card-body gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title min-w-0 text-lg font-semibold">
                      {boat.name}
                    </h3>
                    <span className="badge badge-warning shrink-0 gap-1 font-semibold">
                      <Star
                        size={14}
                        aria-hidden="true"
                        className="fill-current"
                      />
                      {boat.rating}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-base-content/70">
                    <p className="flex items-center gap-1.5">
                      <MapPin
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-primary"
                      />
                      <span className="truncate">{boat.zone.join(", ")}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{boat.captain}</span>
                    </p>

                    <p className="flex items-center gap-1.5 text-base-content">
                      <UsersRound
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-primary"
                      />
                      Capacidad: {boat.capacity} personas
                    </p>
                  </div>

                  <div className="card-actions mt-3">
                    <button
                      type="button"
                      className="btn btn-primary w-full"
                      aria-haspopup="dialog"
                      onClick={() => setSelectedBoat(boat)}
                    >
                      Preguntar disponibilidad
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedBoat && (
        <AskAvailabilityModal
          boatName={selectedBoat.name}
          onClose={() => setSelectedBoat(null)}
        />
      )}
    </div>
  );
}
