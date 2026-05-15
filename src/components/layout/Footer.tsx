import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-sonnengelb">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-bold mb-2">Dresdner Tages Eltern e.&#8239;V.</p>
          <p className="text-text-soft">
            Gemeinsam stark für die Kleinsten unserer Stadt.
          </p>
        </div>

        <nav>
          <p className="font-bold mb-2">Rechtliches</p>
          <ul className="space-y-1">
            <li><Link href="/impressum" className="hover:underline">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:underline">Datenschutz</Link></li>
          </ul>
        </nav>

        <div>
          <p className="font-bold mb-2">Folge uns</p>
          <a
            href="https://www.instagram.com/dresdnertageseltern?igsh=MTFheGJldjNheXhzNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
