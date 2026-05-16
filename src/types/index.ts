// Gemeinsame TypeScript-Typen, die nicht direkt aus Prisma kommen.
// Prisma-Modelle werden via `import type { Tagesmutter } from "@prisma/client"` importiert.

export type Beratungsgebiet = "MALWINA" | "OUTLAW" | "KINDERLAND";

export const PIN_TAGESMUTTER = "/images/pins/outlaw.png";

export const PIN_BERATUNGSSTELLE: Record<Beratungsgebiet, string> = {
  MALWINA: "/images/pins/malwina.png",
  OUTLAW: "/images/pins/kinderland.png",
  KINDERLAND: "/images/pins/tageseltern2.png",
};

export const BERATUNGSGEBIET_LABEL: Record<Beratungsgebiet, string> = {
  MALWINA: "Malwina e.V.",
  OUTLAW: "Outlaw gGmbH",
  KINDERLAND: "KINDERLAND-Sachsen e.V.",
};

export const BERATUNGSSTELLE_URL: Record<Beratungsgebiet, string> = {
  MALWINA:
    "https://www.malwina-dresden.de/beratungs-und-vermittlungsstelle-fuer-kindertagespflege",
  OUTLAW:
    "https://www.outlaw-ggmbh.de/einrichtung/kindertagespflege-dresden",
  KINDERLAND: "https://kindertagespflege.kinderland-sachsen.de/",
};

export type Verpflegung = "SELBST_GEKOCHT" | "CATERING";

export const VERPFLEGUNG_LABEL: Record<Verpflegung, string> = {
  SELBST_GEKOCHT: "Ich koche selbst",
  CATERING: "Catering",
};
