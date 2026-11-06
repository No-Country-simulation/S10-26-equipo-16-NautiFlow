import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { BoatTrip } from "../boatAdmin/types";
import type { BoatRequest } from "../adminPanel/types";
import { isAvailable } from "../boatAdmin/availability";
import { Api } from "../../services/Api";
import { assignApiTrip, getApiTrips } from "../../services/Trips.Service";

type OperatorWithBoats = {
  nombre: string;
  telefono: string;
  estadoVerificacion: string;
  boats?: Array<{
    id: string;
    nombreEmbarcacion: string;
    capacidad: number;
    zonaCobertura: string[] | string;
    activa?: boolean;
  }>;
};

function normalizeZone(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function boatCoversTrip(boat: BoatRequest, trip: BoatTrip) {
  if (!trip.coverageZone) return true;
  const targetZone = normalizeZone(trip.coverageZone);
  return boat.zone.some((zone) => normalizeZone(zone) === targetZone);
}

function normalizeCoverageZones(value: string[] | string): string[] {
  if (Array.isArray(value)) return value;
  return value.split(",").map((zone) => zone.trim()).filter(Boolean);
}

export default function AssignBoatModal({
  trip,
  onClose,
  onAssigned,
}: {
  trip: BoatTrip;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [boatId, setBoatId] = useState("");
  const [error, setError] = useState("");
  const [boats, setBoats] = useState<BoatRequest[]>([]);
  const [trips, setTrips] = useState<BoatTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      Api.get<OperatorWithBoats[]>("/boat-operators"),
      getApiTrips(),
    ])
      .then(([operatorsResponse, loadedTrips]) => {
        if (!active) return;
        const operators = Array.isArray(operatorsResponse.data)
          ? operatorsResponse.data
          : [];
        setBoats(
          operators.flatMap((operator) =>
            (operator.boats ?? []).map((boat) => ({
                id: boat.id,
                name: boat.nombreEmbarcacion,
                captain: operator.nombre,
                phone: operator.telefono,
                zone: normalizeCoverageZones(boat.zonaCobertura),
                capacity: boat.capacidad,
                active: boat.activa,
                status: operator.estadoVerificacion === "VERIFIED"
                  ? "verified" as const
                  : operator.estadoVerificacion === "REJECTED"
                    ? "rejected" as const
                    : "pending" as const,
              })),
          ),
        );
        setTrips(loadedTrips);
      })
      .catch(() => {
        if (active) {
          setError(
            "No se pudieron cargar las lanchas verificadas y los viajes. Intenta de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const verifiedActiveBoats = boats.filter(
    (boat) => boat.status === "verified" && boat.active !== false,
  );
  const capacityBoats = verifiedActiveBoats.filter(
    (boat) => boat.capacity >= (trip.capacity ?? 1),
  );
  const zoneBoats = capacityBoats.filter((boat) => boatCoversTrip(boat, trip));
  const availableBoats = zoneBoats.filter((boat) =>
    isAvailable(boat, trips, trip.date, trip.time, trip.capacity ?? 1),
  );
  const busyBoats = zoneBoats.filter((boat) =>
    trips.some(
      (scheduledTrip) =>
        scheduledTrip.boatId === boat.id &&
        scheduledTrip.date === trip.date &&
        scheduledTrip.time === trip.time,
    ),
  );

  async function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const currentTrips = await getApiTrips();
      const current = currentTrips.find(
        (item) => item.id === trip.id && item.status === "unassigned",
      );
      const boat = availableBoats.find((item) => item.id === boatId);
      if (
        !current ||
        !boat ||
        !boatCoversTrip(boat, current) ||
        !isAvailable(
          boat,
          currentTrips,
          current.date,
          current.time,
          current.capacity ?? 1,
        )
      ) {
        setError(
          "El viaje o la lancha ya no están disponibles. Revisa la selección.",
        );
        return;
      }
      await assignApiTrip(current.id, boat.id);
      onAssigned();
    } catch {
      setError("No se pudo asignar la lancha al viaje. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="assign-boat-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <form onSubmit={assign} className="modal-box">
        <h2 id="assign-boat-title" className="mb-4 text-xl">
          Asignar embarcación
        </h2>
        <p className="mb-4">
          {trip.zone} · {trip.coverageZone ? `${trip.coverageZone} · ` : ""}{trip.date} · {trip.time} hs · {trip.capacity ?? 1}{" "}
          pasajeros
        </p>
        <label className="block">
          Embarcación
          <select
            className="select mt-2 w-full"
            required
            value={boatId}
            onChange={(event) => setBoatId(event.target.value)}
            disabled={isLoading || isSaving}
          >
            <option value="">Selecciona una embarcación</option>
            {availableBoats.map((boat) => (
              <option key={boat.id} value={boat.id}>
                {boat.name} · {boat.capacity} pasajeros
              </option>
            ))}
          </select>
        </label>
        {isLoading && (
          <p role="status" className="mt-3">
            Cargando lanchas disponibles…
          </p>
        )}
        {!isLoading && !availableBoats.length && (
          <div role="status" className="mt-3 rounded-lg bg-base-200 p-3 text-sm">
            {boats.length === 0 ? (
              <p>No hay lanchas registradas. Registra una y aprueba su verificación desde el panel.</p>
            ) : verifiedActiveBoats.length === 0 ? (
              <p>No hay lanchas aprobadas y activas. Revisa la verificación de la lancha en el panel.</p>
            ) : capacityBoats.length === 0 ? (
              <p>Las lanchas aprobadas no tienen capacidad suficiente para {trip.capacity ?? 1} pasajeros.</p>
            ) : zoneBoats.length === 0 ? (
              <p>Hay capacidad, pero ninguna lancha cubre la zona “{trip.coverageZone ?? "sin especificar"}” solicitada para esta ruta. Revisa la zona elegida en el viaje y las zonas registradas en la lancha.</p>
            ) : (
              <p>La ruta y capacidad coinciden, pero {busyBoats.length === 1 ? `“${busyBoats[0].name}” ya tiene` : "las lanchas compatibles ya tienen"} otro viaje para {trip.date} a las {trip.time}. Elige otro horario o libera esa disponibilidad.</p>
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="mt-3 text-error">
            {error}
          </p>
        )}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!boatId || isLoading || isSaving}
          >
            {isSaving ? "Asignando…" : "Asignar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
