import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Ups, hier gibt es noch keinen Inhalt.</h1>
      <p className="text-text-soft mb-8">
        Wir arbeiten daran – kommt später gerne noch einmal vorbei!
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-korallenrot text-white px-6 py-3 font-semibold hover:bg-korallenrot-dunkel transition-colors"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
