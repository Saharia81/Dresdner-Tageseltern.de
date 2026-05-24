import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { MobileNav } from "./MobileNav";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const NAV = [
  { href: "/fuer-eltern/kindertagespflege", label: "Was ist Kindertagespflege?" },
  { href: "/kindertagespflege-finden", label: "Tageseltern finden" },
  { href: "/fuer-eltern", label: "Für Eltern" },
  { href: "/fuer-tageseltern", label: "Für Tageseltern" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-sonnengelb shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Startseite">
          <Image
            src="/images/logo-icon.png"
            alt=""
            width={200}
            height={200}
            priority
            className="h-10 md:h-12 w-auto rounded-sm"
          />
          {/* Schriftzug */}
          <div className={`${poppins.className} flex flex-col leading-none`}>
            <span className="text-sm md:text-base tracking-wide">Dresdner</span>
            <span className="text-sm md:text-base tracking-wide" style={{marginTop: '-4px'}}>Tageseltern e.V.</span>
          </div>
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
