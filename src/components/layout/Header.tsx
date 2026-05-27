import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { MobileNav } from "./MobileNav";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });

const NAV: Array<
  | { href: string; label: string; children?: undefined }
  | { label: string; href?: undefined; children: { href: string; label: string }[] }
> = [
  { href: "/fuer-eltern/kindertagespflege", label: "Was ist Kindertagespflege?" },
  { href: "/kindertagespflege-finden", label: "Tageseltern finden" },
  {
    label: "Für Eltern",
    children: [
      { href: "/fuer-eltern/eingewoehnung-und-ersatzbetreuung", label: "Eingewöhnung & Ersatzbetreuung" },
      { href: "/fuer-eltern/aktionswoche", label: "Aktionswoche Kindertagespflege" },
      { href: "/fuer-eltern/downloads", label: "Downloads" },
    ],
  },
  {
    label: "Für Tageseltern",
    children: [
      { href: "/fuer-tageseltern/mitglied-werden", label: "Mitglied werden" },
      { href: "/fuer-tageseltern/bannervermietung", label: "Bannervermietung" },
      { href: "/fuer-tageseltern/vereinsnews", label: "Vereinsnews" },
    ],
  },
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
          <div className={`${poppins.className} flex flex-col leading-none`}>
            <span className="text-sm md:text-base tracking-wide">Dresdner</span>
            <span className="text-sm md:text-base tracking-wide" style={{ marginTop: "-4px" }}>Tageseltern e.V.</span>
          </div>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {NAV.map((item) => {
              if (item.children) {
                return (
                  <li key={item.label} className="relative group">
                    {/* Trigger */}
                    <span className="flex items-center gap-1 font-semibold text-sm cursor-default select-none group-hover:text-korallenrot transition-colors">
                      {item.label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                        className="transition-transform duration-200 group-hover:rotate-180"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    {/* Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block">
                      <ul className="bg-white rounded-xl shadow-lg py-2 min-w-[260px]">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-4 py-2.5 text-sm font-medium hover:bg-sonnengelb/40 transition-colors"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-semibold text-sm hover:text-korallenrot transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
