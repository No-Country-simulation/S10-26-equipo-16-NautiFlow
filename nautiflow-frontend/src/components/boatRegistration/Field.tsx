import type { FieldProps } from "./BoatFormTypes";

export default function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}