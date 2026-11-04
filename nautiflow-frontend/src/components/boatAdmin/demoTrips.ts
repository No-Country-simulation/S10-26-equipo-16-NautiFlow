import type { BoatTrip } from "./types";

// Datos de demostración; sustituir por una consulta de viajes por boatId.
export const demoTrips: BoatTrip[] = [
  { id: "trip-1", boatId: "1", date: "2026-11-01", time: "09:00", zone: "Cancún", status: "completed", rating: 4, reviewLinkGenerated: true },
  { id: "trip-2", boatId: "1", date: "2026-11-02", time: "15:00", zone: "Isla Mujeres", status: "completed", rating: null, reviewLinkGenerated: false },
  { id: "trip-3", boatId: "1", date: "2026-12-10", time: "10:30", zone: "Cancún", status: "scheduled", rating: null, reviewLinkGenerated: false },
  { id: "trip-4", boatId: "2", date: "2026-11-01", time: "11:00", zone: "Isla Mujeres", status: "completed", rating: 5, reviewLinkGenerated: true },
  { id: "trip-5", boatId: "2", date: "2026-12-11", time: "14:00", zone: "Cozumel", status: "scheduled", rating: null, reviewLinkGenerated: false },
];
