import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kontakt",
  description: "Kontaktiere den Verein Dresdner Tages Eltern e.V.",
});

export default function KontaktPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Kontakt</h1>
      <p className="text-text-soft text-lg">Inhalt folgt.</p>
    </main>
  );
}
