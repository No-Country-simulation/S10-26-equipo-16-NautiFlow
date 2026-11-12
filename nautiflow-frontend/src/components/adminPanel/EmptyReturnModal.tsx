import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Ship } from "lucide-react";
import {
  createEmptyLeg,
  getAvailableBoats,
} from "../../services/EmptyLegs.Service";
import type { AvailableBoat } from "../../services/EmptyLegs.Service";
import { DELTA_ZONES } from "../../constants/deltaZones";

const controlClass =
  "select select-bordered w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const inputClass =
  "input input-bordered w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

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
      <div className="modal-box max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-base-300 bg-base-100 p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ship size={22} aria-hidden="true" />
          </span>
          <h2 id="empty-return-title" className="text-xl font-semibold">
            Anunciar regreso vacío
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-base-content/80">
              Lancha verificada
            </span>
            <select
              className={controlClass}
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
            <span className="mb-1.5 block text-sm font-medium text-base-content/80">
              Zona de origen
            </span>
            <select
              className={controlClass}
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
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-base-content/80">
              Zona de destino
            </span>
            <select
              className={controlClass}
              name="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              disabled={!origin || isSaving}
              required
            >
              <option value="">
                {origin
                  ? "Selecciona la zona de destino"
                  : "Selecciona primero el origen"}
              </option>
              {DELTA_ZONES.filter((zone) => zone !== origin).map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-base-content/80">
                Fecha de salida
              </span>
              <input
                className={inputClass}
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-base-content/80">
                Hora
              </span>
              <input
                className={inputClass}
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
          </div>
          {selectedBoat && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-base-content/80">
              El retorno se publicará para{" "}
              <span className="font-semibold text-primary">
                {selectedBoat.name}
              </span>
              .
            </div>
          )}
          {isLoadingBoats && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200/60 p-3 text-sm text-base-content/70"
            >
              <span className="loading loading-spinner loading-xs text-primary" />
              Cargando lanchas…
            </p>
          )}
          {!isLoadingBoats && !boats.length && (
            <p className="rounded-xl border border-warning/20 bg-warning/10 p-3 text-sm text-base-content/80">
              No hay lanchas verificadas y activas disponibles para anunciar.
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error"
            >
              {error}
            </p>
          )}
          <div className="modal-action flex-col-reverse border-t border-base-300 pt-4 sm:flex-row">
            <button
              type="button"
              className="btn btn-ghost w-full sm:w-auto"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
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
