// Phase 2 – QR-Code-Zielseite eines Banners.
// Der angezeigte Steckbrief wechselt automatisch, je nachdem, welche
// Tagesmutter den Banner aktuell ausleiht.
type Params = Promise<{ bannerId: string }>;

export default async function BannerSeite({ params }: { params: Params }) {
  const { bannerId } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Banner {bannerId}</h1>
      <p className="text-text-soft">
        Phase 2 – hier erscheint automatisch der Steckbrief der aktuell
        buchenden Tagesmutter.
      </p>
    </main>
  );
}
