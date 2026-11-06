import { useSyncExternalStore } from "react";
import { getTrips, getTripsSnapshot, subscribeTrips } from "./tripStorage";

export function useTrips() {
  useSyncExternalStore(subscribeTrips, getTripsSnapshot);
  return getTrips();
}
