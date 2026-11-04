
import {
  Search,
  CalendarDays,
  Clock,
  Users,
  MapPin,
  X,
} from "lucide-react";

import type { BoatRequestFiltersProps, BoatRequestFiltersState } from "./types";

const ZONES = ["Cancún", "Isla Mujeres", "Cozumel"];

const inputClass =
  "w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20";

export default function BoatRequestFilters({
  filters,
  onChange,
}: BoatRequestFiltersProps) {
  function update<K extends keyof BoatRequestFiltersState>(
    key: K,
    value: BoatRequestFiltersState[K],
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  function clearFilters() {
    onChange({
      query: "",
      date: "",
      time: "",
      capacity: "",
      zone: "",
    });
  }

  const hasFilters = Object.values(filters).some(
    (value) => value !== "",
  );

  return (
    <section
      aria-label="Filtros de solicitudes"
      className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">
          Filtrar solicitudes
        </h2>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-sky-900"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Búsqueda */}
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-gray-600">
            Capitán o embarcación
          </span>

          <div className="relative">
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              aria-label="Buscar solicitudes"
              className={`${inputClass} pl-9`}
              placeholder="Buscar..."
              type="search"
              value={filters.query}
              onChange={(e) => update("query", e.target.value)}
            />
          </div>
        </label>

        {/* Fecha */}
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-gray-600">
            Fecha
          </span>

          <div className="relative">
            <CalendarDays
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              aria-label="Filtrar fecha"
              className={`${inputClass} pl-9`}
              type="date"
              value={filters.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
        </label>

        {/* Horario */}
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-gray-600">
            Horario
          </span>

          <div className="relative">
            <Clock
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              aria-label="Filtrar horario"
              className={`${inputClass} pl-9`}
              type="time"
              value={filters.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </div>
        </label>

        {/* Capacidad */}
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-gray-600">
            Capacidad mínima
          </span>

          <div className="relative">
            <Users
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              aria-label="Filtrar capacidad mínima"
              className={`${inputClass} pl-9`}
              type="number"
              min={1}
              step={1}
              placeholder="Pasajeros"
              value={filters.capacity}
              onChange={(e) => update("capacity", e.target.value)}
            />
          </div>
        </label>

        {/* Zona */}
        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-gray-600">
            Zona
          </span>

          <div className="relative">
            <MapPin
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              aria-label="Filtrar zona"
              className={`${inputClass} appearance-none pl-9`}
              value={filters.zone}
              onChange={(e) => update("zone", e.target.value)}
            >
              <option value="">Todas las zonas</option>

              {ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>
    </section>
  );
}