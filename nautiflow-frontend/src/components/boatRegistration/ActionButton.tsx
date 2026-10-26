
import type { ActionButtonProps } from "./boatFormTypes";

export default function ActionButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}: ActionButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";

  const variants = {
    primary: "bg-primary text-primary-content hover:opacity-90",
    ghost: "border border-base-300 bg-base-100 hover:bg-base-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}