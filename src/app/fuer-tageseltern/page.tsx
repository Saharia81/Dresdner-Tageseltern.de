import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Für Tageseltern",
  description: "Informationen für Tageseltern in Dresden.",
});

export default function FuerTageselternPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        Für Tageseltern
      </h1>
      <p className="text-text-soft text-lg">Inhalt folgt.</p>
    </main>
  );
}
