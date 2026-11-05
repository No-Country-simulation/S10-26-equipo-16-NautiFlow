import { ExternalLink, FileText } from "lucide-react";
import { useEffect, useRef } from "react";
import type { BoatRequest } from "./types";

type DocumentsModalProps = {
  boat: BoatRequest;
  onClose: () => void;
};

export default function DocumentsModal({ boat, onClose }: DocumentsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const documents = boat.documents ?? [];

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="documents-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box max-w-2xl">
        <h2 id="documents-modal-title" className="text-xl font-semibold">
          Documentos de {boat.name}
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          Capitán: {boat.captain}
        </p>

        {documents.length ? (
          <ul className="mt-6 space-y-3">
            {documents.map((document) => (
              <li
                key={`${document.name}-${document.url}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-base-300 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText
                    size={20}
                    className="shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium">{document.name}</span>
                </div>
                <a
                  className="btn btn-outline btn-sm shrink-0"
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver documento
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-xl bg-base-200 p-4 text-sm text-base-content/70">
            No hay documentos disponibles para esta embarcación.
          </p>
        )}

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
}
