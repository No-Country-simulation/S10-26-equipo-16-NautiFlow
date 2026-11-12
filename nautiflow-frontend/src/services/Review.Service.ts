import axios from "axios";
import { Api } from "./Api";
import type { BoatTrip } from "../components/boatAdmin/types";

type IssueReviewTokenResponse = { token: string };
type ReviewTokenStatusResponse = { used: boolean };

export async function generateReviewLink(tripId: string) {
  const { data } = await Api.post<IssueReviewTokenResponse>("/reviews/tokens", {
    tripId,
  });
  if (typeof data?.token !== "string" || data.token.length === 0) {
    throw new Error("El servidor no devolvió un token válido para la reseña.");
  }
  return `${window.location.origin}/review-trip/${encodeURIComponent(data.token)}`;
}

export async function getReviewTokenStatus(token: string) {
  try {
    const { data } = await Api.get<ReviewTokenStatusResponse>(
      `/reviews/tokens/${encodeURIComponent(token)}/status`,
    );
    if (typeof data?.used !== "boolean") {
      throw new Error("El servidor devolvió un estado de reseña inválido.");
    }
    return data.used ? "used" : "available";
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return "invalid";
    }
    throw new Error("No se pudo validar el enlace de reseña.", {
      cause: error,
    });
  }
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
