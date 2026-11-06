import { Api } from "./Api";

export type ApiEmptyLeg = {
  id: string;
  zonaOrigen: string;
  zonaDestino: string;
  horaSalida: string;
  estado: "AVAILABLE" | "ASSIGNED" | "COMPLETED" | "CANCELLED";
  boat: {
    id: string;
    nombreEmbarcacion: string;
  };
};

export type EmptyLeg = {
  id: string;
  boatId: string;
  boatName: string;
  origin: string;
  destination: string;
  departure: string;
};

export type AvailableBoat = {
  id: string;
  name: string;
  operatorStatus: string;
  active: boolean;
};

export async function getEmptyLegs(): Promise<EmptyLeg[]> {
  const { data } = await Api.get<ApiEmptyLeg[]>("/empty-legs");
  return (Array.isArray(data) ? data : [])
    .filter((leg) => leg.estado === "AVAILABLE")
    .map((leg) => ({
      id: leg.id,
      boatId: leg.boat.id,
      boatName: leg.boat.nombreEmbarcacion,
      origin: leg.zonaOrigen,
      destination: leg.zonaDestino,
      departure: leg.horaSalida,
    }));
}

export async function createEmptyLeg(input: {
  boatId: string;
  origin: string;
  destination: string;
  departure: string;
}) {
  const { data } = await Api.post<ApiEmptyLeg>("/empty-legs", {
    lanchaId: input.boatId,
    zonaOrigen: input.origin,
    zonaDestino: input.destination,
    horaSalida: input.departure,
  });
  return data;
}

export async function getAvailableBoats(): Promise<AvailableBoat[]> {
  type Operator = {
    estadoVerificacion: string;
    boats?: Array<{
      id: string;
      nombreEmbarcacion: string;
      activa?: boolean;
    }>;
  };
  const { data } = await Api.get<Operator[]>("/boat-operators");
  return (Array.isArray(data) ? data : []).flatMap((operator) =>
    operator.estadoVerificacion === "VERIFIED"
      ? (operator.boats ?? [])
          .filter((boat) => boat.activa !== false)
          .map((boat) => ({
            id: boat.id,
            name: boat.nombreEmbarcacion,
            operatorStatus: operator.estadoVerificacion,
            active: boat.activa !== false,
          }))
      : [],
  );
}
