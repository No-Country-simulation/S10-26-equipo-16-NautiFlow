import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import BoatHistoryRow from "../components/boatAdmin/BoatHistoryRow";
import type { BoatTrip } from "../components/boatAdmin/types";
import BackToAdminBtn from "../components/adminPanel/BackToAdminBtn";
import { getApiTrips } from "../services/Trips.Service";

export default function BoatHistory() {
  const [searchParams] = useSearchParams();
  const boatId = searchParams.get("boatId");
  const boatName = searchParams.get("boatName") || boatId;
  const [trips, setTrips] = useState<BoatTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedBoatId, setLoadedBoatId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    if (!boatId) return;

    getApiTrips()
      .then((loadedTrips) => {
        if (active) {
          setTrips(loadedTrips.filter((trip) => trip.boatId === boatId));
          setLoadedBoatId(boatId);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setLoadedBoatId(boatId);
          setError(
            "No fue posible cargar el historial de viajes. Revisa tu conexión e intenta de nuevo.",
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
  }, [boatId, refreshKey]);

  function refreshTrips() {
    setIsLoading(true);
    setError("");
    setRefreshKey((key) => key + 1);
  }

  const isLoadingHistory = isLoading || loadedBoatId !== boatId;
  const completed = trips
    .filter((trip) => trip.status === "completed")
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  const scheduled = trips
    .filter((trip) => trip.status === "scheduled")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return (
    <PageContainer>
      <BackToAdminBtn />
      <h1 className="mb-4">
        Viajes{boatId ? ` de ${boatName}` : " de la embarcación"}
      </h1>
      {!boatId ? (
        <p>
          Selecciona una embarcación desde el panel de administración para
          consultar sus viajes.
        </p>
      ) : (
        <>
          {isLoadingHistory && (
            <p role="status">Cargando historial de viajes…</p>
          )}
          {!isLoadingHistory && error && (
            <div className="mb-6 space-y-2">
              <p role="alert" className="text-error">
                {error}
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={refreshTrips}
              >
                Reintentar
              </button>
            </div>
          )}
          {!isLoadingHistory && !error && (
            <>
              <section aria-labelledby="completed-trips" className="mb-8">
                <h2 id="completed-trips" className="mb-4 text-xl">
                  Historial de viajes
                </h2>
                <div className="space-y-3">
                  {completed.length ? (
                    completed.map((trip) => (
                      <BoatHistoryRow
                        key={trip.id}
                        trip={trip}
                        onUpdated={refreshTrips}
                        onAssigned={refreshTrips}
                      />
                    ))
                  ) : (
                    <p>Esta embarcación no tiene viajes realizados.</p>
                  )}
                </div>
              </section>
              <section aria-labelledby="scheduled-trips">
                <h2 id="scheduled-trips" className="mb-4 text-xl">
                  Viajes futuros asignados
                </h2>
                <div className="space-y-3">
                  {scheduled.length ? (
                    scheduled.map((trip) => (
                      <BoatHistoryRow
                        key={trip.id}
                        trip={trip}
                        onUpdated={refreshTrips}
                        onAssigned={refreshTrips}
                      />
                    ))
                  ) : (
                    <p>Esta embarcación no tiene viajes futuros asignados.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
