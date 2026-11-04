export type BoatTrip = {
  id: string;
  boatId: string | null;
  boatName?: string;
  emptyReturn?: boolean;
  date: string;
  time: string;
  zone: string;
  capacity?: number;
  status: "completed" | "scheduled" | "unassigned";
  rating: 1 | 2 | 3 | 4 | 5 | null;
  // El backend debe persistir este estado y garantizar una única creación por viaje.
  reviewLinkGenerated: boolean;
};
