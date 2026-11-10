import { useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import type { BoatTrip } from "../boatAdmin/types";
import { createApiTrip } from "../../services/Trips.Service";
import { DELTA_ZONES } from "../../constants/deltaZones";

function getRequestError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string") return message;
  }
  return "No fue posible crear el viaje. Revisa tu conexión e intenta de nuevo.";
}

export default function CreateService() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [zone, setZone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [error, setError] = useState("");
  const [createdTrip, setCreatedTrip] = useState<BoatTrip | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setCreatedTrip(null);
    setIsSubmitting(true);
    try {
      const trip = await createApiTrip({
        origen: origin.trim(),
        destino: destination.trim(),
        zona: zone,
        date,
        time,
        capacity: Number(capacity),
      });
      setCreatedTrip(trip);
      setDate("");
      setTime("");
      setOrigin("");
      setDestination("");
      setZone("");
      setCapacity("");
      window.dispatchEvent(new Event("nautiflow:trips-changed"));
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="create-service-title"
      className="mb-5 rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5"
    >
      <h2 id="create-service-title" className="mb-4 text-xl">
        Crear nuevo viaje
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Origen</span>
          <input
            className="input w-full"
            required
            maxLength={150}
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Destino</span>
          <input
            className="input w-full"
            required
            maxLength={150}
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Zona del Delta</span>
          <select className="select w-full" required value={zone} onChange={(event) => setZone(event.target.value)}>
            <option value="">Selecciona una zona</option>
            {DELTA_ZONES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Fecha de salida</span>
          <input
            className="input w-full"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Hora de salida</span>
          <input
            className="input w-full"
            type="time"
            required
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>
        <label className="block min-w-0">
          <span className="mb-1 block text-sm">Cantidad de pasajeros</span>
          <input
            className="input w-full"
            type="number"
            min={1}
            step={1}
            required
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando…" : "Crear viaje sin asignar"}
        </button>
        <p className="text-sm text-base-content/60 sm:col-span-2 lg:col-span-3">
          El viaje se guardará en el sistema como pendiente. Después podrás
          asignarle manualmente una lancha verificada desde “Todos los
          servicios”.
        </p>
        {error && (
          <p
            role="alert"
            className="text-sm text-error sm:col-span-2 lg:col-span-3"
          >
            {error}
          </p>
        )}
      </form>
      {createdTrip && (
        <p role="status" className="mt-4 rounded-xl bg-success/10 p-3 text-sm">
          Viaje creado correctamente: {createdTrip.zone} ({createdTrip.coverageZone}), {createdTrip.date} a
          las {createdTrip.time}. Ya aparece en la lista del backend.
        </p>
      )}
    </section>
  );
}
