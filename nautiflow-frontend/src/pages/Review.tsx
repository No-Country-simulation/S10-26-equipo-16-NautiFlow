import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import ReviewForm from "../components/adminPanel/Review";
import { getReviewTokenStatus, submitReview } from "../services/Review.Service";

export default function Review() {
  const { token } = useParams<{ token: string }>();
  const [tokenStatus, setTokenStatus] = useState<{
    token: string;
    status: "available" | "sent" | "invalid" | "error";
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;
    getReviewTokenStatus(token)
      .then((result) => {
        if (active) {
          setTokenStatus({
            token,
            status: result === "used" ? "sent" : result,
          });
        }
      })
      .catch(() => {
        if (active) setTokenStatus({ token, status: "error" });
      });

    return () => {
      active = false;
    };
  }, [token]);
  const status = !token
    ? "invalid"
    : tokenStatus?.token === token
      ? tokenStatus.status
      : "checking";

  return (
    <PageContainer>
      <section className="mx-auto max-w-lg rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-8">
        <h1 className="mb-4 text-2xl">Reseña del viaje</h1>
        {status === "checking" ? (
          <p role="status">Validando el enlace de reseña…</p>
        ) : status === "sent" ? (
          <p role="status">
            ¡Gracias! Tu reseña fue enviada. Este enlace ya no admite
            respuestas.
          </p>
        ) : status === "invalid" ? (
          <p role="alert">El enlace de reseña no es válido.</p>
        ) : status === "error" ? (
          <p role="alert">
            No se pudo validar el enlace. Revisa tu conexión e intenta de nuevo.
          </p>
        ) : (
          <>
            <p className="mb-6">Cuéntanos cómo fue tu experiencia.</p>
            <ReviewForm
              onSubmit={async (rating, comment) => {
                if (!token)
                  throw new Error("El enlace de reseña no es válido.");
                await submitReview(token, rating, comment);
                setTokenStatus({ token, status: "sent" });
              }}
            />
          </>
        )}
      </section>
    </PageContainer>
  );
}
