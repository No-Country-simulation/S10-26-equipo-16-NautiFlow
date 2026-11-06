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
      <h1 className="mb-4">Todos los servicios</h1>
      <ServiceFilters value={filter} onChange={setFilter} />
      {isLoading && <p role="status">Cargando servicios…</p>}
      {error && (
        <p role="alert" className="text-error">
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
            <p role="status">No hay servicios para este filtro.</p>
          )}
        </div>
      )}
    </PageContainer>
  );
}
