import { CalendarDays, Clock, MapPin, Search, Users, X } from "lucide-react";
import type { BoatRequestFiltersProps, BoatRequestFiltersState } from "./types";
import { DELTA_ZONES } from "../../constants/deltaZones";

const inputClass =
  "w-full min-w-0 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 text-sm text-base-content outline-none transition placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function BoatRequestFilters({
  filters,
  onChange,
}: BoatRequestFiltersProps) {
  function update<K extends keyof BoatRequestFiltersState>(
    key: K,
    value: BoatRequestFiltersState[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange({
      query: "",
      date: "",
      time: "",
      capacity: "",
      zone: "",
      verification: "verified",
    });
  }

  const hasFilters =
    Boolean(
      filters.query ||
      filters.date ||
      filters.time ||
      filters.capacity ||
      filters.zone,
    ) || filters.verification !== "verified";

  return (
    <section
      aria-label="Filtros para buscar lanchas"
      className="mb-6 rounded-2xl border border-base-300/80 bg-base-100 p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-base-content">
          Buscar lanchas
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Capitán o embarcación
          </span>
          <div className="relative">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              aria-label="Buscar capitán o embarcación"
              className={`${inputClass} pl-9`}
              placeholder="Buscar..."
              type="search"
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Fecha
          </span>
          <div className="relative">
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              aria-label="Filtrar fecha"
              className={`${inputClass} pl-9`}
              type="date"
              value={filters.date}
              onChange={(event) => update("date", event.target.value)}
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Horario
          </span>
          <div className="relative">
            <Clock
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              aria-label="Filtrar horario"
              className={`${inputClass} pl-9`}
              type="time"
              value={filters.time}
              onChange={(event) => update("time", event.target.value)}
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Capacidad mínima
          </span>
          <div className="relative">
            <Users
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              aria-label="Filtrar capacidad mínima"
              className={`${inputClass} pl-9`}
              type="number"
              min={1}
              step={1}
              placeholder="Pasajeros"
              value={filters.capacity}
              onChange={(event) => update("capacity", event.target.value)}
            />
          </div>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Zona
          </span>
          <div className="relative">
            <MapPin
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <select
              aria-label="Filtrar zona"
              className={`${inputClass} pl-9`}
              value={filters.zone}
              onChange={(event) => update("zone", event.target.value)}
            >
              <option value="">Todas las zonas</option>
              {DELTA_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-base-content/70">
            Verificación
          </span>
          <select
            aria-label="Filtrar por verificación"
            className={inputClass}
            value={filters.verification}
            onChange={(event) =>
              update(
                "verification",
                event.target.value as BoatRequestFiltersState["verification"],
              )
            }
          >
            <option value="verified">Solo verificadas</option>
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </label>
      </div>
    </section>
  );
}
