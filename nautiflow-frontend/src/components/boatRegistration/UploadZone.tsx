import { Upload } from "lucide-react";
import type { UploadZoneProps } from "./BoatFormTypes";

export default function UploadZone({
  title,
  description,
  icon,
  accept,
  multiple = false,
  onChange,
  ariaLabel,
}: UploadZoneProps) {
  return (
    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.03] px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
      {icon ?? <Upload size={24} className="text-primary" />}

      <span className="text-sm font-semibold">{title}</span>

      <span className="text-xs text-base-content/60">{description}</span>

      <input
        aria-label={ariaLabel}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
      />
    </label>
  );
}
