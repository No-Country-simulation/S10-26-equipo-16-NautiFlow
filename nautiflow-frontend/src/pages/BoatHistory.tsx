import {  useSearchParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import BoatHistoryRow from "../components/boatAdmin/BoatHistoryRow";
import { getTrips } from "../components/boatAdmin/tripStorage";
import BackToAdminBtn from "../components/adminPanel/BackToAdminBtn";

export default function BoatHistory() {
  const [searchParams] = useSearchParams();
  const boatId = searchParams.get("boatId");
  const boatName = searchParams.get("boatName") || boatId;
  const trips = getTrips().filter((trip) => trip.boatId === boatId);
  const completed = trips.filter((trip) => trip.status === "completed")
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  const scheduled = trips.filter((trip) => trip.status === "scheduled")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return (
    <PageContainer>
      <BackToAdminBtn/>
      <h1 className="mb-4">Viajes{boatId ? ` de ${boatName}` : " de la embarcación"}</h1>
      {!boatId ? (
        <p>Selecciona una embarcación desde el panel de administración para consultar sus viajes.</p>
      ) : (
        <>
          <p className="mb-6 text-sm text-base-content/60">Datos de ejemplo y viajes guardados en este navegador. La consulta real y la generación única de enlaces de reseña están pendientes de integración.</p>
          <section aria-labelledby="completed-trips" className="mb-8">
            <h2 id="completed-trips" className="mb-4 text-xl">Historial de viajes</h2>
            <div className="space-y-3">
              {completed.length ? completed.map((trip) => <BoatHistoryRow key={trip.id} trip={trip} />) : <p>Esta embarcación no tiene viajes realizados.</p>}
            </div>
          </section>
          <section aria-labelledby="scheduled-trips">
            <h2 id="scheduled-trips" className="mb-4 text-xl">Viajes futuros asignados</h2>
            <div className="space-y-3">
              {scheduled.length ? scheduled.map((trip) => <BoatHistoryRow key={trip.id} trip={trip} />) : <p>Esta embarcación no tiene viajes futuros asignados.</p>}
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
}
