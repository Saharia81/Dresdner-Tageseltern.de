export const metadata = {
  title: "Tagesmutter finden – Dresdner Tages Eltern e.V.",
  description: "Übersicht aller Tagesmütter und Tagesväter im Verein – mit Karte und Steckbrief.",
};

export default function TagesmutterFindenPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Tagesmutter finden</h1>
      <p className="text-text-soft mb-8">
        Hier entstehen die Steckbrief-Übersicht und die Karte mit allen Tagesmüttern.
      </p>
      <div className="rounded-2xl bg-sonnengelb/40 p-8 text-center">
        Karte folgt
      </div>
    </main>
  );
}
