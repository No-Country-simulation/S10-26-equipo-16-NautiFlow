import { ExternalLink, FileText, Ship } from "lucide-react";
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
      aria-describedby="documents-modal-captain"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-base-300 bg-base-100 p-5 shadow-2xl sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ship size={22} aria-hidden="true" />
          </span>
          <h2 id="documents-modal-title" className="text-xl font-semibold">
            Documentos de {boat.name}
          </h2>
        </div>
        <p
          id="documents-modal-captain"
          className="mt-4 rounded-xl border border-base-300 bg-base-200/50 px-4 py-3 text-sm text-base-content/70"
        >
          Capitán: <span className="font-medium text-base-content">{boat.captain}</span>
        </p>

        {documents.length ? (
          <ul className="mt-5 space-y-3">
            {documents.map((document) => (
              <li
                key={`${document.name}-${document.url}`}
                className="flex flex-col gap-3 rounded-xl border border-base-300 bg-base-100 p-4 transition-colors hover:border-primary/30 hover:bg-base-200/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
                  className="btn btn-outline btn-sm w-full shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
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
          <p
            role="status"
            className="mt-5 rounded-xl border border-base-300 bg-base-200/60 p-4 text-sm text-base-content/70"
          >
            No hay documentos disponibles para esta embarcación.
          </p>
        )}

        <div className="modal-action border-t border-base-300 pt-4">
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
}
