import { useEffect, useState } from "react";
import { getEmptyLegs } from "../../services/EmptyLegs.Service";
import type { EmptyLeg } from "../../services/EmptyLegs.Service";

export default function EmptyReturnColumn({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const [legs, setLegs] = useState<EmptyLeg[]>([]);
  const [loadedRefreshKey, setLoadedRefreshKey] = useState<number | null>(null);
  const [error, setError] = useState("");
  const isLoading = loadedRefreshKey !== refreshKey;

  useEffect(() => {
    let active = true;
    getEmptyLegs()
      .then((loadedLegs) => {
        if (active) {
          setLegs(loadedLegs);
          setError("");
          setLoadedRefreshKey(refreshKey);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar los retornos vacíos.");
          setLoadedRefreshKey(refreshKey);
        }
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <aside
      aria-labelledby="empty-return-column-title"
      className="flex min-h-0 flex-col rounded-2xl border border-base-300 bg-base-100 p-3 xl:flex-1"
    >
      <h2
        id="empty-return-column-title"
        className="mb-3 shrink-0 text-lg font-semibold"
      >
        Retornos vacíos disponibles
      </h2>
      <div className="space-y-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
        {isLoading && (
          <p role="status" className="text-sm">
            Cargando retornos…
          </p>
        )}
        {!isLoading && error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}
        {!isLoading &&
          !error &&
          legs.map((leg) => {
            const departure = new Date(leg.departure);
            return (
              <article
                key={leg.id}
                className="rounded-xl border border-base-300 bg-base-100 p-3 transition-colors hover:border-primary/30 hover:bg-base-200/50"
              >
                <h3 className="font-semibold">{leg.boatName}</h3>
                <p className="mt-1 text-sm">
                  {leg.origin} → {leg.destination}
                </p>
                <p className="mt-1 text-xs text-base-content/70">
                  {new Intl.DateTimeFormat("es-CO", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(departure)}
                </p>
              </article>
            );
          })}
        {!isLoading && !error && !legs.length && (
          <p className="text-sm text-base-content/60">
            No hay retornos vacíos disponibles.
          </p>
        )}
      </div>
    </aside>
  );
}
