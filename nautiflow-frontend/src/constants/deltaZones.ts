export const DELTA_ZONES = [
  "Tigre Centro",
  "Primera Sección del Delta",
  "Segunda Sección del Delta",
  "Tercera Sección del Delta",
] as const;

export type DeltaZone = (typeof DELTA_ZONES)[number];
