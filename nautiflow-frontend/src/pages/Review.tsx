import { useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import ReviewForm from "../components/adminPanel/Review";
import { submitReview } from "../services/Review.Service";

export default function Review() {
  const { token } = useParams<{ token: string }>();
  const [sent, setSent] = useState(false);

  return (
    <PageContainer>
      <section className="mx-auto max-w-lg rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-8">
        <h1 className="mb-4 text-2xl">Reseña del viaje</h1>
        {sent ? (
          <p role="status">
            ¡Gracias! Tu reseña fue enviada. Este enlace ya no admite
            respuestas.
          </p>
        ) : !token ? (
          <p role="alert">El enlace de reseña no es válido.</p>
        ) : (
          <>
            <p className="mb-6">
              Cuéntanos cómo fue tu experiencia. El enlace se validará al enviar
              la reseña.
            </p>
            <ReviewForm
              onSubmit={async (rating, comment) => {
                await submitReview(token, rating, comment);
                setSent(true);
              }}
            />
          </>
        )}
      </section>
    </PageContainer>
  );
}
