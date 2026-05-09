// Gemeinsame TypeScript-Typen, die nicht direkt aus Prisma kommen.
// Prisma-Modelle werden via `import type { Tagesmutter } from "@prisma/client"` importiert.

export type Beratungsgebiet = "MALVINA" | "OUTDOOR" | "KINDERLAND";

export const PIN_FARBE: Record<Beratungsgebiet, string> = {
  MALVINA: "#3b82f6",     // blau
  OUTDOOR: "#f97316",     // orange
  KINDERLAND: "#ef4444",  // rot
};
