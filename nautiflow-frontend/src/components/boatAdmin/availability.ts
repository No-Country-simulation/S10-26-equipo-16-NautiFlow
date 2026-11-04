import type { BoatRequest } from "../adminPanel/types";
import type { BoatTrip } from "./types";

export function isAvailable(boat: BoatRequest, trips: BoatTrip[], date: string, time: string, capacity: number) {
  return boat.status === "verified" && boat.capacity >= capacity &&
    !trips.some((trip) => trip.boatId === boat.id && trip.date === date && trip.time === time);
}
