import { useState } from "react";
import type { SubmitEvent } from "react";
import { Star } from "lucide-react";
import type { BoatTrip } from "../boatAdmin/types";

type Rating = NonNullable<BoatTrip["rating"]>;
const RATINGS: Rating[] = [1, 2, 3, 4, 5];

export default function Review({ onSubmit }: { onSubmit: (rating: Rating, comment: string) => Promise<void> }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    if (rating === null) {
      setError("Selecciona una calificación de 1 a 5 estrellas.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await onSubmit(rating, comment);
    } catch (error) {
      setError(error instanceof Error ? error.message : "No se pudo enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={sending}>
        <legend className="mb-2 font-medium">Califica tu viaje</legend>
        <div className="flex flex-wrap gap-1">
          {RATINGS.map((value) => (
            <button key={value} type="button" aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`} aria-pressed={rating === value}
              className="btn btn-ghost btn-square text-amber-500" onClick={() => { setRating(value); setError(""); }}>
              <Star size={30} aria-hidden="true" fill={rating !== null && value <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm" role="status">{rating === null ? "Selecciona de 1 a 5 estrellas" : `${rating} de 5 estrellas`}</p>
      </fieldset>
      <label className="block">
        <span className="mb-2 block font-medium">Comentario (opcional)</span>
        <textarea className="textarea min-h-32 w-full" value={comment} onChange={(event) => setComment(event.target.value)} disabled={sending} placeholder="Cuéntanos cómo fue tu experiencia" />
      </label>
      {error && <p role="alert" className="text-error">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" disabled={sending}>{sending ? "Enviando…" : "Enviar reseña"}</button>
    </form>
  );
}
