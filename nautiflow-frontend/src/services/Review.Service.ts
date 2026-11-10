import axios from "axios";
import { Api } from "./Api";
import type { BoatTrip } from "../components/boatAdmin/types";

type IssueReviewTokenResponse = { token: string };

export async function generateReviewLink(tripId: string) {
  const { data } = await Api.post<IssueReviewTokenResponse>("/reviews/tokens", {
    tripId,
  });
  if (typeof data?.token !== "string" || data.token.length === 0) {
    throw new Error("El servidor no devolvió un token válido para la reseña.");
  }
  return `${window.location.origin}/review-trip/${encodeURIComponent(data.token)}`;
}

export async function submitReview(
  token: string,
  rating: NonNullable<BoatTrip["rating"]>,
  comment: string,
) {
  try {
    await Api.post("/reviews", {
      token,
      rating,
      ...(comment.trim() ? { comment: comment.trim() } : {}),
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400 || status === 404 || status === 409) {
        throw new Error("El enlace no es válido o ya fue utilizado.", {
          cause: error,
        });
      }
    }
    throw new Error(
      "No se pudo enviar la reseña. Revisa tu conexión e intenta de nuevo.",
      { cause: error },
    );
  }
}
