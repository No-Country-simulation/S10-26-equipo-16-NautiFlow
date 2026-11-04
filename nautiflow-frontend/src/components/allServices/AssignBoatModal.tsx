import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import type { BoatTrip } from "../boatAdmin/types";
import { getBoats } from "../boatAdmin/boatCatalog";
import { getTrips, saveTrip } from "../boatAdmin/tripStorage";
import { isAvailable } from "../boatAdmin/availability";

export default function AssignBoatModal({ trip, onClose, onAssigned }: { trip: BoatTrip; onClose: () => void; onAssigned: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [boatId, setBoatId] = useState("");
  const [error, setError] = useState("");
  const boats = getBoats().filter((boat) => isAvailable(boat, getTrips(), trip.date, trip.time, trip.capacity ?? 1));

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function assign(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const currentTrips = getTrips();
      const current = currentTrips.find((item) => item.id === trip.id);
      const boat = getBoats().find((item) => item.id === boatId);
      if (!current || current.status !== "unassigned" || !boat || !isAvailable(boat, currentTrips, current.date, current.time, current.capacity ?? 1)) {
        setError("El servicio o la embarcación ya no están disponibles. Revisa la selección.");
        return;
      }
      saveTrip({ ...current, boatId: boat.id, boatName: boat.name, status: "scheduled" });
      onAssigned();
    } catch {
      setError("No se pudo guardar la asignación. Inténtalo nuevamente.");
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="assign-boat-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <form onSubmit={assign} className="modal-box">
        <h2 id="assign-boat-title" className="mb-4 text-xl">Asignar embarcación</h2>
        <p className="mb-4">Zona {trip.zone} · {trip.date} · {trip.time} hs · {trip.capacity ?? 1} pasajeros</p>
        <label className="block">Embarcación
          <select className="select mt-2 w-full" required value={boatId} onChange={(event) => setBoatId(event.target.value)}>
            <option value="">Selecciona una embarcación</option>
            {boats.map((boat) => <option key={boat.id} value={boat.id}>{boat.name} · {boat.capacity} pasajeros</option>)}
          </select>
        </label>
        {!boats.length && <p className="mt-3">No hay embarcaciones verificadas con capacidad suficiente y disponibles para esta fecha y hora.</p>}
        {error && <p role="alert" className="mt-3 text-error">{error}</p>}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={!boatId}>Asignar</button>
        </div>
      </form>
    </dialog>
  );
}
