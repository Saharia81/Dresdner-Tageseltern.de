import Link from "next/link";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/kindertagespflege-finden", label: "Tageseltern finden" },
  { href: "/fuer-eltern/kindertagespflege", label: "Was ist Kindertagespflege?" },
  { href: "/fuer-eltern", label: "Für Eltern" },
  { href: "/fuer-tageseltern", label: "Für Tageseltern" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-sonnengelb shadow-sm relative">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-sm md:text-base leading-tight flex flex-col"
        >
          <span>Dresdner</span>
          <span>Tageseltern e.&#8239;V.</span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-semibold text-sm hover:text-korallenrot transition-colors"
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
