export type BoatRequestFiltersState = {
  query: string;
  date: string;
  time: string;
  capacity: string;
  zone: string;
  verification: "all" | VerificationStatus;
};

export type BoatRequestFiltersProps = {
  filters: BoatRequestFiltersState;
  onChange: (filters: BoatRequestFiltersState) => void;
};

export type VerificationStatus = "pending" | "verified" | "rejected";

export type BoatRequest = {
  id: string;
  verificationId?: string;
  name: string;
  captain: string;
  phone: string;
  zone: string[];
  capacity: number;
  active?: boolean;
  status: VerificationStatus;
  documents?: BoatDocument[];
};

export type BoatDocument = {
  name: string;
  url: string;
};

export type VerificationCardProps = {
  boat: BoatRequest;
  isUpdating?: boolean;
  onStatusChange: (
    id: string,
    status: VerificationStatus,
  ) => void | Promise<void>;
  onViewDocuments?: (boat: BoatRequest) => void;
  onAssignTrip?: (boat: BoatRequest) => void;
};
