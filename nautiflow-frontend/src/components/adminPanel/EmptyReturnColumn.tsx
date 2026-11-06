import BoatHistoryRow from "../boatAdmin/BoatHistoryRow";
import { useTrips } from "../boatAdmin/useTrips";

export default function EmptyReturnColumn() {
  const trips = useTrips().filter((trip) => trip.emptyReturn && trip.status === "unassigned" && !trip.boatId)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  return (
    <aside aria-labelledby="empty-return-column-title" className="rounded-2xl border border-base-300 bg-base-200 p-3 xl:max-h-[calc(100dvh-10rem)] xl:overflow-y-auto">
      <h2 id="empty-return-column-title" className="mb-3 text-lg">Retornos vacíos sin asignar</h2>
      <div className="space-y-3">
        {trips.map((trip) => <BoatHistoryRow key={trip.id} trip={trip} />)}
        {!trips.length && <p className="text-sm text-base-content/60">No hay retornos vacíos sin asignar.</p>}
      </div>
    </aside>
  );
}
