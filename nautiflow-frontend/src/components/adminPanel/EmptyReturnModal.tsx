import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  createEmptyLeg,
  getAvailableBoats,
} from "../../services/EmptyLegs.Service";
import type { AvailableBoat } from "../../services/EmptyLegs.Service";
import { DELTA_ZONES } from "../../constants/deltaZones";

type EmptyReturnModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

export default function EmptyReturnModal({
  onClose,
  onCreated,
}: EmptyReturnModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [boats, setBoats] = useState<AvailableBoat[]>([]);
  const [boatId, setBoatId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoadingBoats, setIsLoadingBoats] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    let active = true;
    getAvailableBoats()
      .then((loadedBoats) => {
        if (active) setBoats(loadedBoats);
      })
      .catch(() => {
        if (active) setError("No se pudieron cargar las lanchas verificadas.");
      })
      .finally(() => {
        if (active) setIsLoadingBoats(false);
      });
    return () => {
      active = false;
      dialog?.close();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (origin === destination) {
      setError("La zona de destino debe ser distinta de la zona de origen.");
      return;
    }
    setIsSaving(true);
    try {
      await createEmptyLeg({
        boatId,
        origin: origin.trim(),
        destination: destination.trim(),
        departure: new Date(`${date}T${time}:00`).toISOString(),
      });
      onCreated();
    } catch {
      setError(
        "No se pudo anunciar el retorno. Verifica que la fecha y hora sean futuras e intenta de nuevo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const selectedBoat = boats.find((boat) => boat.id === boatId);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="empty-return-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-box max-w-lg">
        <h2 id="empty-return-title" className="mb-5 text-xl font-semibold">
          Anunciar regreso vacío
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Lancha verificada
            </span>
            <select
              className="select w-full"
              required
              value={boatId}
              onChange={(event) => setBoatId(event.target.value)}
              disabled={isLoadingBoats || isSaving}
            >
              <option value="">Selecciona una lancha</option>
              {boats.map((boat) => (
                <option key={boat.id} value={boat.id}>
                  {boat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Zona de origen
            </span>
            <select
              className="select w-full"
              name="origin"
              value={origin}
              onChange={(event) => {
                const nextOrigin = event.target.value;
                setOrigin(nextOrigin);
                if (nextOrigin === destination) setDestination("");
              }}
              disabled={isSaving}
              required
            >
              <option value="">Selecciona la zona de origen</option>
              {DELTA_ZONES.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Zona de destino
            </span>
            <select
              className="select w-full"
              name="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              disabled={!origin || isSaving}
              required
            >
              <option value="">{origin ? "Selecciona la zona de destino" : "Selecciona primero el origen"}</option>
              {DELTA_ZONES.filter((zone) => zone !== origin).map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">
                Fecha de salida
              </span>
              <input
                className="input w-full"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Hora</span>
              <input
                className="input w-full"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
          </div>
          {selectedBoat && (
            <p className="rounded-xl bg-base-200 p-3 text-sm">
              El retorno se publicará para {selectedBoat.name}.
            </p>
          )}
          {isLoadingBoats && (
            <p role="status" className="text-sm">
              Cargando lanchas…
            </p>
          )}
          {!isLoadingBoats && !boats.length && (
            <p className="text-sm">
              No hay lanchas verificadas y activas disponibles para anunciar.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-error">
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
              className="btn btn-error"
              disabled={isLoadingBoats || !boats.length || isSaving}
            >
              {isSaving ? "Publicando…" : "Publicar retorno"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
