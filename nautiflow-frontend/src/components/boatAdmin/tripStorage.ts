import { demoTrips } from "./demoTrips";
import type { BoatTrip } from "./types";

const STORAGE_KEY = "nautiflow.assigned-trips";

export function getTrips(): BoatTrip[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  const assigned: BoatTrip[] = stored ? JSON.parse(stored) : [];
  return [...demoTrips.filter((demo) => !assigned.some((trip) => trip.id === demo.id)), ...assigned];
}

export function saveTrip(trip: BoatTrip) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const assigned: BoatTrip[] = stored ? JSON.parse(stored) : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...assigned.filter((item) => item.id !== trip.id), trip]));
  window.dispatchEvent(new Event("nautiflow:trips-changed"));
}

export function subscribeTrips(onChange: () => void) {
  window.addEventListener("nautiflow:trips-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("nautiflow:trips-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getTripsSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}
