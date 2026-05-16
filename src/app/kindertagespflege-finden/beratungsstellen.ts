// Adressen + Koordinaten der drei Beratungsstellen,
// die als zusätzliche Pins auf der Karte erscheinen.

import type { Beratungsgebiet } from "@/types";

export type BeratungsstelleEintrag = {
  schluessel: Beratungsgebiet;
  name: string;
  strasse: string;
  plz: string;
  latitude: number;
  longitude: number;
};

export const BERATUNGSSTELLEN: BeratungsstelleEintrag[] = [
  {
    schluessel: "MALWINA",
    name: "Malwina e.V.",
    strasse: "Leipziger Straße 118 (Dachgeschoss)",
    plz: "01127",
    latitude: 51.07728,
    longitude: 13.71764,
  },
  {
    schluessel: "OUTLAW",
    name: "Outlaw gGmbH",
    strasse: "An der Pikardie 6",
    plz: "01277",
    latitude: 51.03302,
    longitude: 13.77578,
  },
  {
    schluessel: "KINDERLAND",
    name: "KINDERLAND-Sachsen e.V.",
    strasse: "Berggartenstraße 5",
    plz: "01309",
    latitude: 51.05057,
    longitude: 13.80481,
  },
];
