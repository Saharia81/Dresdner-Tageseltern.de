import Link from "next/link";
import { BackToTop } from "@/components/ui/BackToTop";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { analyticsEnabled } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="bg-sonnengelb">
      <div className="mx-auto max-w-6xl px-4 pt-6 flex justify-end">
        <BackToTop />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="font-bold mb-2">Dresdner Tages Eltern e.V.</p>
          <p className="text-text-soft">
            Gemeinsam stark für die Kleinsten unserer Stadt.
          </p>
          <a
            href="mailto:info@dresdner-tageseltern.de"
            className="text-text-soft hover:underline mt-2 inline-block"
          >
            info@dresdner-tageseltern.de
          </a>
        </div>

        <nav>
          <p className="font-bold mb-2">Rechtliches</p>
          <ul className="space-y-1">
            <li><Link href="/impressum" className="hover:underline">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:underline">Datenschutz</Link></li>
            {analyticsEnabled && <li><CookieSettingsLink /></li>}
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
