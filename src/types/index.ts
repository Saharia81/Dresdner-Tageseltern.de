// Gemeinsame TypeScript-Typen, die nicht direkt aus Prisma kommen.
// Prisma-Modelle werden via `import type { Tagesmutter } from "@prisma/client"` importiert.

export type Beratungsgebiet = "MALWINA" | "OUTLAW" | "KINDERLAND";

export const PIN_FARBE: Record<Beratungsgebiet, string> = {
  MALWINA: "#3b82f6",    // blau
  OUTLAW: "#f97316",     // orange
  KINDERLAND: "#ef4444", // rot
};

export const BERATUNGSGEBIET_LABEL: Record<Beratungsgebiet, string> = {
  MALWINA: "Malwina e.V.",
  OUTLAW: "Outlaw gGmbH",
  KINDERLAND: "KINDERLAND-Sachsen e.V.",
};

export type Verpflegung = "SELBST_GEKOCHT" | "CATERING";

export const VERPFLEGUNG_LABEL: Record<Verpflegung, string> = {
  SELBST_GEKOCHT: "Ich koche selbst",
  CATERING: "Catering",
};
