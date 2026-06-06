import { notFound } from "next/navigation";
import { getTagesmutterById } from "@/lib/steckbriefe";
import { SteckbriefForm, type SteckbriefFormData } from "./SteckbriefForm";

export const dynamic = "force-dynamic";

const LEER: SteckbriefFormData = {
  vorname: "",
  nachname: "",
  einrichtungsname: "",
  fotoUrl: "",
  einrichtungsfotoUrls: "",
  strasse: "",
  plz: "",
  stadtteil: "",
  latitude: "",
  longitude: "",
  telefon: "",
  email: "",
  websiteUrl: "",
  anmeldungUrl: "",
  oeffnungszeiten: "",
  ersatzbetreuung: "",
  verpflegung: "SELBST_GEKOCHT",
  verpflegungHinweis: "",
  beratungsgebiet: "MALWINA",
  schmetterling: false,
  schmetterlingPartner: "",
  mitgliedsnummer: "",
  mitgliedSeit: "",
  istAktiv: true,
  reihenfolge: "0",
};

function isoDatum(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function SteckbriefBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const istNeu = id === "neu";

  let initial = LEER;
  if (!istNeu) {
    const tm = await getTagesmutterById(id);
    if (!tm) notFound();
    initial = {
      vorname: tm.vorname,
      nachname: tm.nachname,
      einrichtungsname: tm.einrichtungsname,
      fotoUrl: tm.fotoUrl,
      einrichtungsfotoUrls: tm.einrichtungsfotoUrls.join("\n"),
      strasse: tm.strasse,
      plz: tm.plz,
      stadtteil: tm.stadtteil,
      latitude: tm.latitude?.toString() ?? "",
      longitude: tm.longitude?.toString() ?? "",
      telefon: tm.telefon,
      email: tm.email,
      websiteUrl: tm.websiteUrl ?? "",
      anmeldungUrl: tm.anmeldungUrl ?? "",
      oeffnungszeiten: tm.oeffnungszeiten,
      ersatzbetreuung: tm.ersatzbetreuung,
      verpflegung: tm.verpflegung,
      verpflegungHinweis: tm.verpflegungHinweis ?? "",
      beratungsgebiet: tm.beratungsgebiet,
      schmetterling: tm.schmetterling,
      schmetterlingPartner: tm.schmetterlingPartner ?? "",
      mitgliedsnummer: tm.mitgliedsnummer ?? "",
      mitgliedSeit: isoDatum(tm.mitgliedSeit),
      istAktiv: tm.istAktiv,
      reihenfolge: tm.reihenfolge.toString(),
    };
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        {istNeu
          ? "Neues Mitglied anlegen"
          : `${initial.vorname} ${initial.nachname} bearbeiten`}
      </h1>
      <SteckbriefForm id={istNeu ? null : id} initial={initial} />
    </main>
  );
}
