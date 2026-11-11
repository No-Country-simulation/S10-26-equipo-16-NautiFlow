import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const PHONE_NUMBER = "+55 5555555555";

export default function AskAvailabilityModal({ boatName, onClose }: {
  boatName: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const message = `Hola me gustaría conocer los detalles de la embarcación ${boatName}`;
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      setCopyStatus("Número copiado al portapapeles.");
    } catch {
      setCopyStatus("No se pudo copiar el número. Puedes seleccionarlo y copiarlo manualmente.");
    }
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="availability-title"
      aria-describedby="availability-description" onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}>
      <div className="modal-box">
        <button type="button" className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2"
          aria-label="Cerrar" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id="availability-title" className="mb-3 pr-8 text-xl">Preguntar disponibilidad</h2>
        <p id="availability-description" className="wrap-break-word">
          Por favor envía un mensaje de WhatsApp al número <span className="select-text font-semibold">{PHONE_NUMBER}</span> para que te envíen la información de la unidad <strong>{boatName}</strong>.
        </p>
        <div className="modal-action flex-wrap">
          <button type="button" className="btn btn-outline" onClick={copyNumber}>Copiar número</button>
          <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Enviar mensaje</a>
        </div>
        <p role="status" className="mt-2 text-sm">{copyStatus}</p>
      </div>
    </dialog>
  );
}
