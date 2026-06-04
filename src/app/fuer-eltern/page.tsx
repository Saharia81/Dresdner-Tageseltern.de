import Link from "next/link";

export const metadata = {
  title: "Für Eltern – Dresdner Tages Eltern e.V.",
  description: "Alles, was Eltern über Kindertagespflege in Dresden wissen sollten.",
};

export default function FuerElternPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Für Eltern</h1>
      <p className="mb-8 text-text-soft">
        Herzlich willkommen. Hier findet ihr alle Informationen rund um die
        Kindertagespflege in Dresden.
      </p>
      <ul className="space-y-3 list-disc pl-6">
        <li><Link className="underline" href="/fuer-eltern/kindertagespflege">Was ist Kindertagespflege?</Link></li>
        <li><Link className="underline" href="/fuer-eltern/eingewoehnung-und-ersatzbetreuung">Eingewöhnung &amp; Ersatzbetreuung</Link></li>
        <li><Link className="underline" href="/fuer-eltern/vorteile">Vorteile gegenüber der Kita</Link></li>
        <li><Link className="underline" href="/fuer-eltern/faq">Häufige Fragen</Link></li>
        <li><Link className="underline" href="/kindertagespflege-finden">Tagesmutter finden</Link></li>
        <li><Link className="underline" href="/fuer-eltern/aktionswoche">Aktionswoche</Link></li>
      </ul>
    </main>
  );
}
