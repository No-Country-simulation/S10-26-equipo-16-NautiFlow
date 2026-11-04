import type { ServiceFilter } from "./types";

const filters: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "unassigned", label: "Sin asignar" },
  { value: "empty", label: "Regresos vacíos" },
  { value: "completed", label: "Terminados" },
  { value: "scheduled", label: "Por realizar" },
];

export default function ServiceFilters({ value, onChange }: { value: ServiceFilter; onChange: (value: ServiceFilter) => void }) {
  return (
    <div role="group" aria-label="Filtrar servicios" className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button key={filter.value} type="button" aria-pressed={value === filter.value} onClick={() => onChange(filter.value)} className={`btn rounded-full ${value === filter.value ? "btn-primary" : "btn-outline"}`}>
          {filter.label}
        </button>
      ))}
    </div>
  );
}
