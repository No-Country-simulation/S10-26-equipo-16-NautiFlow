import { getTrips, saveTrip } from "../components/boatAdmin/tripStorage";
import type { BoatTrip } from "../components/boatAdmin/types";

// Adaptador local: sustituir por endpoints que validen y consuman el token
// de forma atómica en el servidor para compartir enlaces entre dispositivos.
export function generateReviewLink(tripId: string) {
  const trip = getTrips().find((item) => item.id === tripId);
  if (!trip || trip.status !== "completed" || trip.rating !== null) {
    throw new Error("Solo puedes generar reseñas de viajes finalizados sin calificación.");
  }
  const token = trip.reviewToken || crypto.randomUUID();
  if (!trip.reviewToken) {
    saveTrip({ ...trip, reviewLinkGenerated: true, reviewToken: token });
  }
  return `${window.location.origin}/review-trip/${encodeURIComponent(token)}`;
}

export async function submitReview(token: string, rating: NonNullable<BoatTrip["rating"]>, comment: string) {
  // Serializa envíos entre pestañas del mismo navegador; la garantía global
  // de uso único corresponde al futuro backend.
  return navigator.locks.request(`nautiflow-review:${token}`, () => {
    const trip = getTrips().find((item) => item.reviewToken === token);
    if (!trip || trip.status !== "completed" || trip.rating !== null) {
      throw new Error("Este enlace no es válido o la reseña ya fue enviada.");
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Selecciona una calificación de 1 a 5 estrellas.");
    }
    saveTrip({ ...trip, rating, reviewComment: comment.trim(), reviewedAt: new Date().toISOString() });
  });
}
