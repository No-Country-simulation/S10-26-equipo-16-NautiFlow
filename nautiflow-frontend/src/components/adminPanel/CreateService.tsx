import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import type { BoatRequest } from "./types";
import { useTrips } from "../boatAdmin/useTrips";
import { getTrips, saveTrip } from "../boatAdmin/tripStorage";
import type { BoatTrip } from "../boatAdmin/types";

import { isAvailable } from "../boatAdmin/availability";

function AssignmentModal({ message, onClose }: { message: string; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("Mensaje copiado al portapapeles.");
    } catch {
      setCopyStatus("No se pudo copiar. Puedes seleccionar y copiar el texto manualmente.");
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="assignment-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="modal-box">
        <h2 id="assignment-title" className="mb-4 text-xl">Viaje guardado</h2>
        <p className="select-text break-words rounded-xl bg-base-200 p-4">{message}</p>
        <p role="status" className="mt-3 text-sm">{copyStatus}</p>
        <div className="modal-action">
          <button type="button" className="btn btn-outline" onClick={copyMessage}>Copiar mensaje</button>
          <button type="button" className="btn btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </dialog>
  );
}

export default function CreateService({ boats }: { boats: BoatRequest[] }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [zone, setZone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [emptyReturn, setEmptyReturn] = useState(false);
  const [boatId, setBoatId] = useState("");
  const trips = useTrips();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const ready = Boolean(date && time && Number(capacity) > 0);
  const availableBoats = ready ? boats.filter((boat) => isAvailable(boat, trips, date, time, Number(capacity))) : [];
  const selectedBoatId = availableBoats.some((boat) => boat.id === boatId) ? boatId : "";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const currentTrips = getTrips();
      const boat = boats.find((item) => item.id === selectedBoatId);
      if (!date || !time || !zone.trim() || !Number.isInteger(Number(capacity)) || Number(capacity) < 1 ||
          (boatId !== "" && (!boat || !isAvailable(boat, currentTrips, date, time, Number(capacity))))) {
        setError("Selecciona una embarcación verificada, con capacidad suficiente y disponible en esa fecha y hora.");
        return;
      }
      const trip: BoatTrip = {
        id: crypto.randomUUID(), boatId: boat?.id ?? null, boatName: boat?.name, emptyReturn, date, time, zone: zone.trim(), capacity: Number(capacity),
        status: boat ? "scheduled" : "unassigned", rating: null, reviewLinkGenerated: false,
      };
      saveTrip(trip);
      const formattedDate = new Intl.DateTimeFormat("es-MX", { timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
      setMessage(`${boat ? "Asignado" : "Guardado sin asignar"} viaje a zona ${trip.zone} con fecha ${formattedDate} a las ${time}`);
      setBoatId("");
    } catch {
      setError("No se pudo guardar el viaje. Revisa que el almacenamiento del navegador esté disponible e inténtalo nuevamente.");
    }
  }

  return (
    <section aria-labelledby="create-service-title" className="mb-5 rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
      <h2 id="create-service-title" className="mb-4 text-xl">Crear nuevo viaje</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block min-w-0"><span className="mb-1 block text-sm">Fecha</span><input className="input w-full" type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="block min-w-0"><span className="mb-1 block text-sm">Hora</span><input className="input w-full" type="time" required value={time} onChange={(event) => setTime(event.target.value)} /></label>
        <label className="block min-w-0"><span className="mb-1 block text-sm">Zona</span><input className="input w-full" required value={zone} onChange={(event) => setZone(event.target.value)} /></label>
        <label className="block min-w-0"><span className="mb-1 block text-sm">Capacidad requerida</span><input className="input w-full" type="number" min="1" step="1" required value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label>
        <label className="block min-w-0"><span className="mb-1 block text-sm">Embarcación</span>
          <select className="select w-full" disabled={!ready} value={selectedBoatId} onChange={(event) => setBoatId(event.target.value)}>
            <option value="">Sin asignar (opcional)</option>
            {availableBoats.map((boat) => <option key={boat.id} value={boat.id}>{boat.name} · {boat.capacity} pasajeros</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" className="checkbox" checked={emptyReturn} onChange={(event) => setEmptyReturn(event.target.checked)} />Regreso vacío</label>
        <button type="submit" className="btn btn-primary self-end">{selectedBoatId ? "Asignar" : "Guardar sin asignar"}</button>
        <p className="text-sm text-base-content/60 sm:col-span-2 lg:col-span-3">
          {!ready ? "Ingresa fecha, hora y capacidad para consultar embarcaciones." : !availableBoats.length ? "No hay embarcaciones verificadas con capacidad suficiente y disponibles en esa fecha y hora." : "Disponibilidad comprobada por fecha y hora exactas. Los viajes se guardan en este navegador."}
        </p>
        {error && <p role="alert" className="text-sm text-error sm:col-span-2 lg:col-span-3">{error}</p>}
      </form>
      {message && <AssignmentModal message={message} onClose={() => setMessage("")} />}
    </section>
  );
}
