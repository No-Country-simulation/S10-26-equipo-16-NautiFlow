import type { BoatRequest } from "../adminPanel/types";

export const INITIAL_BOATS: BoatRequest[] = [
  {
    id: "1",
    name: "Azul Caribe",
    captain: "Carlos Méndez",
    phone: "9981234567",
    zone: "Cancún",
    capacity: 8,
    status: "pending",
  },
  {
    id: "2",
    name: "Mar Adventure",
    captain: "Luis Pérez",
    phone: "9987654321",
    zone: "Isla Mujeres",
    capacity: 12,
    status: "verified",
  },
  {
    id: "3",
    name: "Ocean Blue",
    captain: "Roberto Díaz",
    phone: "9981122334",
    zone: "Cozumel",
    capacity: 6,
    status: "rejected",
  },
];

export function getBoats(): BoatRequest[] {
  const stored = localStorage.getItem("nautiflow.boats");
  return stored ? JSON.parse(stored) : INITIAL_BOATS;
}
