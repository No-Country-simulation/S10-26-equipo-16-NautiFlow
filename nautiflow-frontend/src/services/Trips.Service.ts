import { Api } from "./Api";
import type { BoatTrip } from "../components/boatAdmin/types";

export type ApiTrip = {
  id: string;
  origen: string;
  destino: string;
  zona?: string | null;
  fechaHoraSalida: string;
  pasajeros: number;
  estado: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  boatId: string | null;
  boat?: { nombreEmbarcacion: string } | null;
};

export function mapApiTrip(trip: ApiTrip): BoatTrip {
  const departure = new Date(trip.fechaHoraSalida);
  const localDate = Number.isNaN(departure.getTime())
    ? ""
    : `${departure.getFullYear()}-${String(departure.getMonth() + 1).padStart(2, "0")}-${String(departure.getDate()).padStart(2, "0")}`;
  const localTime = Number.isNaN(departure.getTime())
    ? ""
    : `${String(departure.getHours()).padStart(2, "0")}:${String(departure.getMinutes()).padStart(2, "0")}`;
  const status: BoatTrip["status"] =
    trip.estado === "COMPLETED"
      ? "completed"
      : trip.estado === "PENDING" || trip.estado === "CANCELLED"
        ? "unassigned"
        : "scheduled";

  return {
    id: trip.id,
    boatId: trip.boatId,
    boatName: trip.boat?.nombreEmbarcacion,
    date: localDate,
    time: localTime,
    zone: `${trip.origen} → ${trip.destino}`,
    coverageZone: trip.zona,
    capacity: trip.pasajeros,
    status,
    rating: null,
    reviewLinkGenerated: false,
  };
}

export async function getApiTrips() {
  const { data } = await Api.get<ApiTrip[]>("/trips");
  return (Array.isArray(data) ? data : [])
    .filter((trip) => trip.estado !== "CANCELLED")
    .map(mapApiTrip);
}

export async function createApiTrip(input: {
  origen: string;
  destino: string;
  zona: string;
  date: string;
  time: string;
  capacity: number;
}) {
  const { data } = await Api.post<ApiTrip>("/trips", {
    origen: input.origen,
    destino: input.destino,
    zona: input.zona,
    fechaHoraSalida: new Date(`${input.date}T${input.time}:00`).toISOString(),
    pasajeros: input.capacity,
  });
  return mapApiTrip(data);
}

export async function assignApiTrip(tripId: string, boatId: string) {
  await Api.patch(`/trips/${tripId}/assign-boat`, { boatId });
}

export async function completeApiTrip(tripId: string) {
  const { data } = await Api.patch<ApiTrip>(`/trips/${tripId}`, {
    estado: "COMPLETED",
  });
  return mapApiTrip(data);
}
