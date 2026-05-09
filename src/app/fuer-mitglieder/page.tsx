import Link from "next/link";

export const metadata = {
  title: "Für Mitglieder – Dresdner Tages Eltern e.V.",
  description: "Bereich für Vereinsmitglieder: Banner buchen, Neuigkeiten, Vereinsinfos.",
};

export default function FuerMitgliederPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Für Mitglieder</h1>
      <ul className="space-y-3 list-disc pl-6">
        <li><Link className="underline" href="/fuer-mitglieder/banner-buchen">Banner buchen</Link></li>
        <li><Link className="underline" href="/fuer-mitglieder/neuigkeiten">Neuigkeiten</Link></li>
      </ul>
    </main>
  );
}
