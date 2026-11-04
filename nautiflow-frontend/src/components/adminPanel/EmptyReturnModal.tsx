import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";

type EmptyReturnModalProps = {
  onClose: () => void;
  onSend: (message: string) => void;
};

export default function EmptyReturnModal({ onClose, onSend }: EmptyReturnModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [boat, setBoat] = useState("");
  const [zone, setZone] = useState("");
  const [time, setTime] = useState("");
  const message = `Lancha ${boat.trim() || "X"} vuelve vacía desde la Zona ${zone.trim() || "Y"} a las ${time || "15:00"}hs. ¿Alguien necesita un rescate o envío en ese trayecto?`;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSend(message);
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="empty-return-title"
      aria-describedby="empty-return-preview"
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
            <span className="mb-1 block text-sm font-medium">Lancha</span>
            <input
              className="input w-full"
              name="boat"
              placeholder="Nombre de la lancha"
              value={boat}
              onChange={(event) => setBoat(event.target.value)}
              required
              pattern=".*\S.*"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Zona</span>
            <input
              className="input w-full"
              name="zone"
              placeholder="Zona de salida"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              required
              pattern=".*\S.*"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Hora</span>
            <input
              className="input w-full"
              name="time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
            />
          </label>
          <p id="empty-return-preview" className="rounded-xl bg-base-200 p-4 text-sm break-words">
            {message}
          </p>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-error">Enviar</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
