import { useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import ReviewForm from "../components/adminPanel/Review";
import { useTrips } from "../components/boatAdmin/useTrips";
import { submitReview } from "../services/Review.Service";

export default function Review() {
  const { token } = useParams<{ token: string }>();
  const trips = useTrips();
  const [sent, setSent] = useState(false);
  const trip = trips.find((item) => item.reviewToken === token && token);

  return (
    <PageContainer>
      <section className="mx-auto max-w-lg rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-8">
        <h1 className="mb-4 text-2xl">Reseña del viaje</h1>
        {sent ? <p role="status">¡Gracias! Tu reseña fue enviada. Este enlace ya no admite respuestas.</p>
          : !trip || trip.status !== "completed" ? <p role="alert">Este enlace no es válido o no está disponible en este navegador.</p>
          : trip.rating !== null ? <p role="status">La reseña de este viaje ya fue enviada. El enlace ya no admite respuestas.</p>
          : <>
            <p className="mb-6">Viaje a {trip.zone} · {trip.date} · {trip.time} hs</p>
            <ReviewForm onSubmit={async (rating, comment) => {
              await submitReview(token!, rating, comment);
              setSent(true);
            }} />
          </>}
      </section>
    </PageContainer>
  );
}
