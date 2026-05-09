type Params = Promise<{ slug: string }>;

export default async function NeuigkeitenDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Beitrag: {slug}</h1>
      <p className="text-text-soft">Inhalt folgt – einzelner Blog-Beitrag.</p>
    </main>
  );
}
