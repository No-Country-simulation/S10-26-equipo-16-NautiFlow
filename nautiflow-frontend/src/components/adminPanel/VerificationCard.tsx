
import {
  BadgeCheck,
  Clock,
  XCircle,
  MapPin,
  Users,
  Phone,
  FileText,
  Check,
  X,
  Ship,
  ArrowRight,
} from "lucide-react";

import type { VerificationCardProps, VerificationStatus } from "./types";
import { Link } from "react-router-dom";


const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    className:
      "border-yellow-300 bg-yellow-100 text-yellow-700",
  },
  verified: {
    label: "Verificado",
    icon: BadgeCheck,
    className:
      "border-green-300 bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rechazado",
    icon: XCircle,
    className:
      "border-red-300 bg-red-100 text-red-700",
  },
} satisfies Record<
  VerificationStatus,
  {
    label: string;
    icon: typeof Clock;
    className: string;
  }
>;

export default function VerificationCard({
  boat,
  onStatusChange,
  onViewDocuments,
  onAssignTrip,
}: VerificationCardProps) {
  const status = STATUS_CONFIG[boat.status];
  const StatusIcon = status.icon;

  return (
    <article className="card w-full border border-base-300 bg-base-100 shadow-sm transition hover:shadow-md">
      <div className="card-body gap-4">

     
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ship size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="card-title truncate text-lg">
                {boat.name}
              </h2>

              <p className="text-sm text-base-content/60">
                {boat.captain}
              </p>
            </div>
          </div>

       
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <StatusIcon size={14} />
            {status.label}
          </span>
        </div>

        <div className="space-y-3 text-sm">

          <div className="flex items-center gap-2 text-base-content/70">
            <Phone size={16} className="shrink-0" />
            <span>{boat.phone}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-base-200 px-3 py-2 text-xs">
              <MapPin size={14} />
              {boat.zone}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-base-200 px-3 py-2 text-xs">
              <Users size={14} />
              {boat.capacity} pasajeros
            </span>
          </div>
        </div>

        <div className="border-t border-base-300" />

        <div className="flex flex-col gap-3">
          <Link
            to={`/boat-history?${new URLSearchParams({ boatId: boat.id, boatName: boat.name })}`}
            className="btn btn-outline btn-sm w-full"
            aria-label={`Viajes de ${boat.name}`}
          >
            Viajes
          </Link>

          <button
            type="button"
            onClick={() => onViewDocuments?.(boat)}
            className="btn btn-outline btn-sm w-full"
          >
            <FileText size={16} />
            Ver documentos
          </button>

          {/* Pending */}
          {boat.status === "pending" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  onStatusChange(boat.id, "rejected")
                }
                className="btn btn-outline btn-error btn-sm"
              >
                <X size={16} />
                Rechazar
              </button>

              <button
                type="button"
                onClick={() =>
                  onStatusChange(boat.id, "verified")
                }
                className="btn btn-success btn-sm"
              >
                <Check size={16} />
                Aprobar
              </button>
            </div>
          )}

          {/* Verified */}
          {boat.status === "verified" && (
            <button
              type="button"
              onClick={() => onAssignTrip?.(boat)}
              className="btn btn-primary btn-sm w-full"
            >
              Asignar viaje
              <ArrowRight size={16} />
            </button>
          )}

          {/* Rejected */}
          {boat.status === "rejected" && (
            <p className="text-center text-xs text-base-content/50">
              Solicitud rechazada
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
