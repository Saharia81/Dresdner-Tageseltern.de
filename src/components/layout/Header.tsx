import Link from "next/link";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/fuer-eltern", label: "Für Eltern" },
  { href: "/fuer-mitglieder", label: "Für Mitglieder" },
  { href: "/mitglied-werden", label: "Mitglied werden" },
  { href: "/ueber-uns", label: "Über uns" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-sonnengelb shadow-sm relative">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg">
          Dresdner Tages Eltern e.&#8239;V.
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-semibold hover:text-korallenrot transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
