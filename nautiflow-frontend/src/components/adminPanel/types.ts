export type BoatRequestFiltersState = {
  query: string;
  date: string;
  time: string;
  capacity: string;
  zone: string;
};

export type BoatRequestFiltersProps = {
  filters: BoatRequestFiltersState;
  onChange: (filters: BoatRequestFiltersState) => void;
};


export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected";

export type BoatRequest = {
  id: string;
  name: string;
  captain: string;
  phone: string;
  zone: string;
  capacity: number;
  status: VerificationStatus;
};

export type VerificationCardProps = {
  boat: BoatRequest;
  onStatusChange: (
    id: string,
    status: VerificationStatus
  ) => void | Promise<void>;
  onViewDocuments?: (boat: BoatRequest) => void;
  onAssignTrip?: (boat: BoatRequest) => void;
};