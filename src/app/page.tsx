import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";

export default function Home() {
  return (
    <main>
      {/* 1 — Hero */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
          <div className="grid gap-4 md:grid-cols-2 md:gap-12 items-center">
            {/* Mobile-only: "Gemeinsam stark" oberhalb des Bildes */}
            <div className="md:hidden flex items-center gap-0 mt-4 mb-0">
              <p className="italic text-text-soft text-2xl leading-tight">
                Gemeinsam stark für die
                <br />
                Kleinsten unserer Stadt
              </p>
              <Image
                src="/images/hero/herzapricot.png"
                alt=""
                width={1536}
                height={1024}
                aria-hidden
                className="w-32 select-none -ml-12 mt-4"
              />
            </div>

            <div className="md:order-2">
              <div
                className="relative aspect-[8/9] rounded-3xl overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 25%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 25%)",
                }}
              >
                <Image
                  src="/images/hero/hero-tagesmutter.png"
                  alt="Tagesmutter spielt mit drei Kleinkindern auf einem Teppich mit Holzspielzeug"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="md:order-1">
              {/* Desktop-only: "Gemeinsam stark" in der linken Spalte */}
              <div className="hidden md:flex items-center gap-0 mt-4 mb-3">
                <p className="italic text-text-soft text-2xl leading-tight">
                  Gemeinsam stark für die
                  <br />
                  Kleinsten unserer Stadt
                </p>
                <Image
                  src="/images/hero/herzapricot.png"
                  alt=""
                  width={1536}
                  height={1024}
                  aria-hidden
                  className="w-32 md:w-40 select-none -ml-12 md:-ml-16 mt-4 md:mt-6"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Kleine Gruppen.
                <br />
                Große Geborgenheit.
              </h1>
              <p className="text-lg text-text-soft mb-8 max-w-lg">
                Kindertagespflege in Dresden mit festen Bezugspersonen,
                liebevoller Begleitung und einer ruhigen, familiären
                Atmosphäre.
              </p>
              <div className="flex flex-wrap gap-4">
                <LinkButton
                  variant="primary"
                  href="/fuer-eltern/tagesmutter-finden"
                >
                  Tageseltern finden
                </LinkButton>
                <LinkButton
                  variant="secondary"
                  href="/fuer-eltern/kindertagespflege"
                >
                  Was ist Kindertagespflege?
                </LinkButton>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 md:mt-16">
            <UspItem
              icon={
                <Image
                  src="/images/icons/kleine-gruppe.png"
                  alt=""
                  width={313}
                  height={313}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  aria-hidden
                />
              }
              title="Kleine Gruppen"
              text="max. 5 Kinder"
            />
            <UspItem
              icon={
                <Image
                  src="/images/icons/bezugsperson.png"
                  alt=""
                  width={313}
                  height={313}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  aria-hidden
                />
              }
              title="Feste"
              text="Bezugsperson"
            />
            <UspItem
              icon={
                <Image
                  src="/images/icons/feder.png"
                  alt=""
                  width={313}
                  height={313}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  aria-hidden
                />
              }
              title="Ruhige"
              text="Atmosphäre"
            />
            <UspItem
              icon={
                <Image
                  src="/images/icons/sparschwein.png"
                  alt=""
                  width={313}
                  height={313}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  aria-hidden
                />
              }
              title="Gleiche Kosten"
              text="wie Kita/Krippe"
            />
          </div>
        </div>
      </section>

      {/* 3 — Such- & Karten-Sektion */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 pb-20 md:pb-24 lg:pb-28">
          <div className="rounded-3xl bg-white p-8 md:p-10 shadow-sm">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Tageseltern in Dresden finden
                </h2>
                <p className="text-text-soft mb-8">
                  Finde liebevolle Tageseltern in deiner Nähe und entdecke
                  freie Plätze für dein Kind.
                </p>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="plz-stadtteil"
                      className="block text-sm text-text-soft mb-1"
                    >
                      Postleitzahl / Stadtteil
                    </label>
                    <input
                      id="plz-stadtteil"
                      type="text"
                      placeholder="z. B. 01067 oder Neustadt"
                      className="w-full rounded-xl border border-text-soft/20 px-4 py-3 text-base focus:outline-none focus:border-korallenrot"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="betreuungsbeginn"
                      className="block text-sm text-text-soft mb-1"
                    >
                      Gewünschter Betreuungsbeginn
                    </label>
                    <input
                      id="betreuungsbeginn"
                      type="text"
                      inputMode="numeric"
                      placeholder="tt.mm.jjjj"
                      pattern="\d{2}\.\d{2}\.\d{4}"
                      className="w-full rounded-xl border border-text-soft/20 px-4 py-3 text-base bg-white focus:outline-none focus:border-korallenrot placeholder:text-text-soft/60"
                    />
                  </div>
                  <LinkButton
                    variant="primary"
                    href="/fuer-eltern/tagesmutter-finden"
                    className="w-full"
                  >
                    Jetzt finden
                  </LinkButton>
                </form>
              </div>

              <div>
                <div className="relative">
                  <div className="relative aspect-[8/5] rounded-2xl overflow-hidden">
                    <Image
                      src="/images/hero/karte-dresden-v3.png"
                      alt="Karte von Dresden mit gelben Pins und Stadtansicht der Frauenkirche"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-8 w-24 h-24 md:w-40 md:h-40 rounded-full bg-sonnengelb flex flex-col items-center justify-start text-center italic text-text-soft leading-tight text-xs md:text-lg pt-4 md:pt-8 px-2 md:px-3 shadow-md">
                    <p>
                      Mit Herz
                      <br />
                      und Zeit
                      <br />
                      für dein Kind
                    </p>
                    <Image
                      src="/images/hero/herzapricot.png"
                      alt=""
                      width={1536}
                      height={1024}
                      aria-hidden
                      className="w-16 md:w-28 select-none -mt-2"
                    />
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Link
                    href="/fuer-eltern/tagesmutter-finden"
                    className="text-text-soft underline hover:text-korallenrot transition-colors"
                  >
                    Zur interaktiven Karte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Feature-Grid */}
      <section className="bg-sonnengelb-hell">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Warum sich Familien für Kindertagespflege entscheiden
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              image="/images/allgemein/kleine-gruppen.png"
              title="Kleine Gruppen"
              text="Maximal 5 Kinder werden individuell betreut und begleitet."
              href="/fuer-eltern/vorteile"
            />
            <FeatureCard
              image="/images/allgemein/feste-bezugsperson.png"
              title="Feste Bezugsperson"
              text="Ein vertrautes Gesicht jeden Tag für Sicherheit und Vertrauen."
              href="/fuer-eltern/vorteile"
            />
            <FeatureCard
              image="/images/allgemein/ruhige-atmosphaere.png"
              title="Ruhige Atmosphäre"
              text="Weniger Reize, mehr Zeit zum Ankommen und Wohlfühlen."
              href="/fuer-eltern/vorteile"
            />
            <FeatureCard
              image="/images/allgemein/gleiche-kosten-2.png"
              title="Gleiche Kosten"
              text="Die Elternbeiträge sind identisch mit denen in Krippe und Kita."
              href="/fuer-eltern/faq"
            />
          </div>
        </div>
      </section>

      {/* 5 — Eingewöhnung */}
      <section className="bg-creme relative overflow-hidden">
        <Image
          src="/images/hero/herz-mit-schweif.png"
          alt=""
          width={400}
          height={280}
          className="hidden md:block absolute bottom-8 right-8 w-64 h-auto opacity-80 select-none pointer-events-none"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mobile-only: Überschrift über dem Foto */}
            <h2 className="md:hidden text-3xl font-extrabold">
              Eingewöhnung mit Herz und Zeit
            </h2>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/allgemein/eingewoehnung.png"
                alt="Eltern mit Kind bei Eingewöhnung"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="hidden md:block text-3xl md:text-4xl font-extrabold mb-6">
                Eingewöhnung mit Herz und Zeit
              </h2>
              <p className="text-text-soft text-lg mb-8 leading-relaxed">
                Jedes Kind ist einzigartig und so ist auch jede
                Eingewöhnung. Wir nehmen uns Zeit, geben Sicherheit und
                begleiten Familien Schritt für Schritt, Hand in Hand.
              </p>
              <LinkButton variant="primary" href="/fuer-eltern/faq">
                Mehr zur Eingewöhnung
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Testimonials */}
      <section className="bg-sonnengelb-hell">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Das sagen Eltern
          </h2>
          <TestimonialCarousel
            items={[
              {
                initials: "LD",
                name: "Lisa aus Dresden",
                quote:
                  "Unsere Tochter fühlt sich bei ihrer Tagesmama so wohl. Wir hatten einen entspannten Start und ein gutes Gefühl von Anfang an.",
              },
              {
                initials: "MB",
                name: "Martin aus Blasewitz",
                quote:
                  "Die kleine Gruppe und die feste Bezugsperson waren für uns genau das Richtige.",
              },
              {
                initials: "SP",
                name: "Sarah aus Pieschen",
                quote:
                  "Die Tagespflege war für uns eine echte Herzensentscheidung — wir würden uns jederzeit wieder so entscheiden.",
              },
            ]}
          />
        </div>
      </section>

      {/* 7 — Final CTA */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
          <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                  Du suchst einen Betreuungsplatz für dein Kind?
                </h2>
                <p className="text-text-soft">Wir helfen dir gerne weiter.</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <LinkButton
                  variant="primary"
                  href="/fuer-eltern/tagesmutter-finden"
                >
                  Tageseltern finden
                </LinkButton>
                <LinkButton variant="secondary" href="/fuer-eltern">
                  Beratung für Eltern
                </LinkButton>
              </div>
            </div>
            <svg
              className="hidden lg:block absolute -right-8 -bottom-4 text-sonnengelb opacity-70"
              width="220"
              height="80"
              viewBox="0 0 220 80"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 60 C 40 20, 80 75, 115 40 S 190 25, 215 55"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </main>
  );
}

function UspItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 justify-center sm:justify-start">
      {icon}
      <div className="leading-tight text-text-soft text-sm">
        <p>{title}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}

function FeatureCard({
  image,
  title,
  text,
  href,
}: {
  image?: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Card className="flex flex-col gap-4 h-full overflow-hidden">
      {image && (
        <div className="relative aspect-[4/3] w-[calc(100%+3rem)] -mx-6 -mt-6 overflow-hidden rounded-t-2xl">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            aria-hidden
          />
        </div>
      )}
      <h3 className="font-bold text-lg hyphens-none">{title}</h3>
      <p className="text-text-soft text-sm flex-1">{text}</p>
      <Link
        href={href}
        className="text-korallenrot font-semibold hover:text-korallenrot-dunkel transition-colors"
      >
        Mehr erfahren →
      </Link>
    </Card>
  );
}

