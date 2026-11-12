import { useCallback, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import BoatHistoryRow from "../components/boatAdmin/BoatHistoryRow";
import ServiceFilters from "../components/allServices/ServiceFilters";
import type { BoatTrip } from "../components/boatAdmin/types";
import type { ServiceFilter } from "../components/allServices/types";
import BackToAdminBtn from "../components/adminPanel/BackToAdminBtn";
import { getApiTrips } from "../services/Trips.Service";

export default function AllServices() {
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [trips, setTrips] = useState<BoatTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrips = useCallback(() => getApiTrips(), []);

  const refreshTrips = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setTrips(await loadTrips());
    } catch {
      setError(
        "No fue posible cargar los servicios. Intenta recargar la página.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadTrips]);

  useEffect(() => {
    let active = true;
    loadTrips()
      .then((loadedTrips) => {
        if (active) {
          setTrips(loadedTrips);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "No fue posible cargar los servicios. Intenta recargar la página.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loadTrips]);

  const visible = trips
    .filter(
      (trip) =>
        filter === "all" ||
        (filter === "empty" ? trip.emptyReturn : trip.status === filter),
    )
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  return (
    <PageContainer>
      <BackToAdminBtn />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="tracking-tight">Todos los servicios</h1>
        {!isLoading && !error && (
          <span className="badge badge-primary badge-outline px-3 py-3">
            {visible.length} {visible.length === 1 ? "servicio" : "servicios"}
          </span>
        )}
      </header>
      <ServiceFilters value={filter} onChange={setFilter} />
      {isLoading && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content/70"
        >
          <span className="loading loading-spinner loading-sm text-primary" />
          Cargando servicios…
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-error/20 bg-error/10 p-4 text-sm text-error"
        >
          {error}
        </p>
      )}
      {!isLoading && !error && (
        <div className="space-y-4">
          {visible.map((trip) => (
            <BoatHistoryRow
              key={trip.id}
              trip={trip}
              onAssigned={refreshTrips}
              onUpdated={refreshTrips}
            />
          ))}
          {!visible.length && (
            <p
              role="status"
              className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center text-base-content/70"
            >
              No hay servicios para este filtro.
            </p>
          )}
        </div>
      )}
    </PageContainer>
  );
}
