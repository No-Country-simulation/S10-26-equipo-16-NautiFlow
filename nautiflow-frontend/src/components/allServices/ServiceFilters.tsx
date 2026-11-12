import type { ServiceFilter } from "./types";

const filters: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "unassigned", label: "Sin asignar" },
  { value: "empty", label: "Regresos vacíos" },
  { value: "completed", label: "Terminados" },
  { value: "scheduled", label: "Por realizar" },
];

export default function ServiceFilters({
  value,
  onChange,
}: {
  value: ServiceFilter;
  onChange: (value: ServiceFilter) => void;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-base-300/80 bg-base-100 p-4 shadow-sm sm:p-5">
      <p className="mb-3 text-sm font-semibold text-base-content">
        Filtrar por estado
      </p>
      <div
        role="group"
        aria-label="Filtrar servicios"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={value === filter.value}
            onClick={() => onChange(filter.value)}
            className={`btn btn-sm rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:btn-md ${
              value === filter.value
                ? "btn-primary shadow-sm"
                : "btn-outline border-base-300 hover:border-primary hover:bg-primary/5"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
