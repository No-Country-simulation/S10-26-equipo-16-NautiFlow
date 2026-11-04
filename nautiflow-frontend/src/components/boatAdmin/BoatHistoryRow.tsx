import { Star } from "lucide-react";
import type { BoatTrip } from "./types";
import { useState } from "react";
import { getBoats } from "./boatCatalog";
import AssignBoatModal from "../allServices/AssignBoatModal";

const STATUS_CONFIG = {
  unassigned: { label: "Sin asignar", className: "border-yellow-300 bg-yellow-100 text-yellow-700" },
  scheduled: { label: "Por realizar", className: "border-blue-300 bg-blue-100 text-blue-700" },
  completed: { label: "Finalizado", className: "border-green-300 bg-green-100 text-green-700" },
};

export default function BoatHistoryRow({ trip, onAssigned }: { trip: BoatTrip; onAssigned?: () => void }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const status = STATUS_CONFIG[trip.status];
  const boatName = trip.boatName || getBoats().find((boat) => boat.id === trip.boatId)?.name;
  const date = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${trip.date}T00:00:00Z`));

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg">{boatName || (trip.boatId ? `Embarcación ${trip.boatId}` : "Embarcación sin asignar")}</h3>
        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}>{status.label}</span>
      </div>
      {trip.emptyReturn && <span className="badge badge-outline">Regreso vacío</span>}
      <dl className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8">
        <div><dt className="text-sm text-base-content/60">Fecha</dt><dd><time dateTime={trip.date}>{date}</time></dd></div>
        <div><dt className="text-sm text-base-content/60">Hora</dt><dd><time dateTime={trip.time}>{trip.time} hs</time></dd></div>
        <div><dt className="text-sm text-base-content/60">Zona</dt><dd>{trip.zone}</dd></div>
        <div>
          <dt className="text-sm text-base-content/60">Calificación</dt>
          <dd className="flex gap-1 text-amber-500" aria-label={trip.rating === null ? "Sin calificación" : `${trip.rating} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={18} aria-hidden="true" fill={trip.rating !== null && index < trip.rating ? "currentColor" : "none"} />
            ))}
          </dd>
        </div>
      </dl>
      {trip.status === "unassigned" && (
        <button type="button" className="btn btn-primary btn-sm self-start" onClick={() => setAssignOpen(true)}>Asignar</button>
      )}
      {assignOpen && (
        <AssignBoatModal trip={trip} onClose={() => setAssignOpen(false)} onAssigned={() => { setAssignOpen(false); onAssigned?.(); }} />
      )}
      {!trip.reviewLinkGenerated && (
        <div className="shrink-0">
          <button type="button" className="btn btn-outline btn-sm w-full" disabled aria-describedby={`review-pending-${trip.id}`}>
            Generar link de reseña
          </button>
          <p id={`review-pending-${trip.id}`} className="mt-1 text-xs text-base-content/60">Disponible próximamente</p>
        </div>
      )}
    </article>
  );
}
