import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { SuchForm } from "./SuchForm";

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
              <div className="flex justify-center md:justify-start">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                  <LinkButton
                    variant="primary"
                    href="/kindertagespflege-finden"
                  >
                    Tageseltern finden
                  </LinkButton>
                  <LinkButton
                    variant="secondary"
                    href="/fuer-eltern/kindertagespflege"
                  >
                    Was ist Kindertagespflege?
                  </LinkButton>
                  <div className="sm:hidden flex flex-col items-start gap-6 mt-6">
                    <UspItem
                      icon={
                        <Image
                          src="/images/icons/kleine-gruppe.png"
                          alt=""
                          width={313}
                          height={313}
                          className="w-16 h-16 object-contain"
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
                          className="w-16 h-16 object-contain"
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
                          className="w-16 h-16 object-contain"
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
                          className="w-16 h-16 object-contain"
                          aria-hidden
                        />
                      }
                      title="Gleiche Kosten"
                      text="wie Kita/Krippe"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 md:mt-16">
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
                <SuchForm />
              </div>

              <div>
                <div className="relative">
                  <Link
                    href="/kindertagespflege-finden"
                    aria-label="Zur Tageseltern-Karte"
                    className="relative block aspect-[8/5] rounded-2xl overflow-hidden group"
                  >
                    <Image
                      src="/images/hero/karte-dresden-v3.png"
                      alt="Karte von Dresden mit gelben Pins und Stadtansicht der Frauenkirche"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </Link>
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
                    href="/kindertagespflege-finden"
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
      <section style={{ backgroundColor: "#fdf7e3" }}>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Warum sich Familien für Kindertagespflege entscheiden
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              image="/images/allgemein/basteln.png"
              title="Kleine Gruppen"
              text="Maximal 5 Kinder werden individuell betreut und begleitet."
            />
            <FeatureCard
              image="/images/allgemein/feste-bezugsperson-v2.png"
              title="Feste Bezugsperson"
              text="Ein vertrautes Gesicht jeden Tag für Sicherheit und Vertrauen."
            />
            <FeatureCard
              image="/images/allgemein/ruhige-atmosphaere.png"
              title="Ruhige Atmosphäre"
              text="Weniger Reize, mehr Zeit zum Ankommen und Wohlfühlen."
            />
            <FeatureCard
              image="/images/allgemein/sparschwein.png"
              title="Gleiche Kosten"
              text="Die Elternbeiträge sind identisch mit denen in Krippe und Kita."
            />
          </div>
        </div>
      </section>

      {/* 5 — Eingewöhnung */}
      <section className="bg-creme relative overflow-hidden">
        <Image
          src="/images/hero/herzapricot-transparent.png"
          alt=""
          width={400}
          height={280}
          className="hidden md:block absolute bottom-24 right-20 w-64 h-auto opacity-80 mix-blend-multiply select-none pointer-events-none"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mobile-only: Überschrift über dem Foto */}
            <h2 className="md:hidden text-3xl font-extrabold">
              Eingewöhnung mit Herz und Zeit
            </h2>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden md:mt-8">
              <Image
                src="/images/allgemein/eingewoehnung-v2.png"
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
              <p className="text-text-soft text-lg leading-relaxed">
                Jedes Kind ist einzigartig und so ist auch jede
                Eingewöhnung. Wir nehmen uns Zeit, geben Sicherheit und
                begleiten Familien Schritt für Schritt, Hand in Hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Verein-Intro */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 pt-8 md:pt-10 lg:pt-12 pb-20 md:pb-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/hero/herzapricot.png"
                alt=""
                width={1536}
                height={1024}
                aria-hidden
                className="w-32 md:w-44 select-none"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Wir sind der Dresdner Tageseltern e.V.
            </h2>
            <p className="text-text-soft text-lg leading-relaxed mb-4">
              Ein Zusammenschluss von über 50 Tageseltern in Dresden.
            </p>
            <p className="italic text-text-soft text-lg mb-10">
              Ihr wollt mehr über uns erfahren?
            </p>
            <LinkButton variant="primary" href="/ueber-uns">
              Lernt uns kennen
            </LinkButton>
          </div>
        </div>
      </section>

      {/* 7 — Testimonials */}
      <section style={{ backgroundColor: "#fdf7e3" }}>
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-24 lg:py-28">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
            Das sagen Eltern
          </h2>
          <TestimonialCarousel
            items={[
              {
                initials: "KB",
                name: "Katrin aus Blasewitz",
                avatar: "/images/testimonials/katrin.png",
                quote:
                  "Unsere Tochter fühlt sich bei ihrer Tagesmama so wohl. Wir hatten einen entspannten Start und ein gutes Gefühl von Anfang an.",
              },
              {
                initials: "TL",
                name: "Thomas aus Löbtau",
                avatar: "/images/testimonials/thomas.png",
                quote:
                  "Wir hatten bereits unsere große Tochter bei der Tagesmutter und nun geht unser Sohn zu ihr.",
              },
              {
                initials: "HN",
                name: "Helene aus Niedersedlitz",
                avatar: "/images/testimonials/helene.png",
                quote:
                  "Ich habe mich bewusst für eine Tagesmama entschieden, da ich meinem Sohn eine kleine Gruppe ermöglichen wollte.",
              },
            ]}
          />
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
}: {
  image?: string;
  title: string;
  text: string;
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
    </Card>
  );
}

