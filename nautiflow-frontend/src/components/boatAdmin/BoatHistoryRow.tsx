import { Star } from "lucide-react";
import type { BoatTrip } from "./types";
import { useState } from "react";
import { getBoats } from "./boatCatalog";
import { useTrips } from "./useTrips";
import { generateReviewLink } from "../../services/Review.Service";
import { completeApiTrip } from "../../services/Trips.Service";
import AssignBoatModal from "../allServices/AssignBoatModal";

const STATUS_CONFIG = {
  unassigned: {
    label: "Sin asignar",
    className: "border-yellow-300 bg-yellow-100 text-yellow-700",
  },
  scheduled: {
    label: "Por realizar",
    className: "border-blue-300 bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Finalizado",
    className: "border-green-300 bg-green-100 text-green-700",
  },
};

export default function BoatHistoryRow({
  trip: initialTrip,
  onAssigned,
  onUpdated,
}: {
  trip: BoatTrip;
  onAssigned?: () => void;
  onUpdated?: () => void;
}) {
  const trips = useTrips();
  const [serverTrip, setServerTrip] = useState<BoatTrip | null>(null);
  const trip =
    trips.find((item) => item.id === initialTrip.id) ??
    serverTrip ??
    initialTrip;
  const [linkStatus, setLinkStatus] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [isGeneratingReviewLink, setIsGeneratingReviewLink] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");

  async function markCompleted() {
    if (isCompleting) return;
    setIsCompleting(true);
    setCompletionError("");
    try {
      setServerTrip(await completeApiTrip(trip.id));
      onUpdated?.();
    } catch {
      setCompletionError("No se pudo completar el viaje. Intenta nuevamente.");
    } finally {
      setIsCompleting(false);
    }
  }

  async function copyReviewLink() {
    if (isGeneratingReviewLink) return;
    setIsGeneratingReviewLink(true);
    setLinkStatus("");
    try {
      const link = reviewLink || (await generateReviewLink(trip.id));
      setReviewLink(link);
      await navigator.clipboard.writeText(link);
      setLinkStatus("Enlace generado y copiado al portapapeles.");
    } catch (error) {
      setLinkStatus(
        error instanceof Error
          ? error.message
          : "No se pudo copiar. Puedes copiar el enlace manualmente.",
      );
    } finally {
      setIsGeneratingReviewLink(false);
    }
  }

  const [assignOpen, setAssignOpen] = useState(false);
  const status = STATUS_CONFIG[trip.status];
  const boatName =
    trip.boatName || getBoats().find((boat) => boat.id === trip.boatId)?.name;
  const date = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${trip.date}T00:00:00Z`));

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg">
          {boatName ||
            (trip.boatId ? `Embarcación ${trip.boatId}` : "Sin asignar")}
        </h3>
        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      {trip.emptyReturn && (
        <span className="badge badge-outline">Regreso vacío</span>
      )}
      <dl className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8">
        <div>
          <dt className="text-sm text-base-content/60">Fecha</dt>
          <dd>
            <time dateTime={trip.date}>{date}</time>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-base-content/60">Hora</dt>
          <dd>
            <time dateTime={trip.time}>{trip.time} hs</time>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-base-content/60">Zona</dt>
          <dd>
            {trip.zone}
            {trip.coverageZone ? ` · ${trip.coverageZone}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-base-content/60">Calificación</dt>
          <dd
            className="flex gap-1 text-amber-500"
            aria-label={
              trip.rating === null
                ? "Sin calificación"
                : `${trip.rating} de 5 estrellas`
            }
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={18}
                aria-hidden="true"
                fill={
                  trip.rating !== null && index < trip.rating
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </dd>
        </div>
      </dl>
      {trip.status === "unassigned" && (
        <button
          type="button"
          className="btn btn-primary btn-sm self-start"
          onClick={() => setAssignOpen(true)}
        >
          Asignar
        </button>
      )}
      {trip.status === "scheduled" && (
        <div className="space-y-2">
          <button
            type="button"
            className="btn btn-success btn-sm self-start"
            onClick={markCompleted}
            disabled={isCompleting}
          >
            {isCompleting ? "Actualizando viaje…" : "Marcar como completado"}
          </button>
          {completionError && (
            <p role="alert" className="text-sm text-error">
              {completionError}
            </p>
          )}
        </div>
      )}
      {assignOpen && (
        <AssignBoatModal
          trip={trip}
          onClose={() => setAssignOpen(false)}
          onAssigned={() => {
            setAssignOpen(false);
            onAssigned?.();
          }}
        />
      )}
      {trip.status === "completed" && trip.rating === null && (
        <div className="space-y-2">
          <button
            type="button"
            className="btn btn-outline btn-sm w-full"
            onClick={copyReviewLink}
          >
            {isGeneratingReviewLink
              ? "Generando enlace…"
              : reviewLink
                ? "Copiar enlace de reseña"
                : "Generar enlace de reseña"}
          </button>
          {reviewLink && (
            <label className="block text-sm">
              Enlace de reseña
              <input
                className="input mt-1 w-full"
                readOnly
                value={reviewLink}
                onFocus={(event) => event.target.select()}
              />
            </label>
          )}
          <p role="status" className="text-sm">
            {linkStatus}
          </p>
        </div>
      )}
    </article>
  );
}
