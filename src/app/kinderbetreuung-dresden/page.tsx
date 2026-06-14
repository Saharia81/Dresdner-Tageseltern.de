import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kinderbetreuung in Dresden – die ruhige Alternative zur Krippe",
  description:
    "Du suchst einen Krippenplatz in Dresden? Kindertagespflege ist die persönliche Alternative: kleine Gruppen, feste Bezugsperson, gleiche Kosten wie die Krippe. Jetzt freie Plätze finden.",
});

const TELEFON = "+4917680700466";
const TELEFON_ANZEIGE = "0176 80700466";
const EMAIL = "info@dresdner-tageseltern.de";

export default function KinderbetreuungDresden() {
  return (
    <main>
      {/* 1 — Hero */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div>
              <p className="italic text-text-soft text-xl mb-4">
                Du suchst einen Krippenplatz in Dresden?
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                Es gibt eine ruhigere Alternative zur Krippe.
              </h1>
              <p className="text-lg text-text-soft mb-8 max-w-lg">
                In der <strong>Kindertagespflege</strong> wird dein Kind in einer
                kleinen Gruppe von einer festen Bezugsperson liebevoll betreut –
                familiär, geborgen und zu den{" "}
                <strong>gleichen Kosten wie in der Krippe</strong>.
              </p>
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <LinkButton variant="primary" href="/kindertagespflege-finden">
                  Freie Plätze finden
                </LinkButton>
                <LinkButton
                  variant="secondary"
                  href="/fuer-eltern/kindertagespflege"
                >
                  Was ist Kindertagespflege?
                </LinkButton>
              </div>
            </div>

            <div className="relative aspect-[8/9] rounded-3xl overflow-hidden">
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
        </div>
      </section>

      {/* 2 — Warum Kindertagespflege */}
      <section style={{ backgroundColor: "#fdf7e3" }}>
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-left md:text-center mb-4">
            Krippe oder Kindertagespflege?
          </h2>
          <p className="text-text-soft text-lg max-w-2xl md:mx-auto md:text-center mb-12">
            Beide werden vom Jugendamt gefördert und kosten Eltern das Gleiche.
            Der Unterschied liegt im Alltag deines Kindes:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Vorteil
              image="/images/allgemein/basteln.png"
              title="Kleine Gruppen"
              text="Maximal 5 Kinder statt großer Gruppen – mehr Zeit und Ruhe für jedes Kind."
            />
            <Vorteil
              image="/images/allgemein/feste-bezugsperson-v2.png"
              title="Feste Bezugsperson"
              text="Ein vertrautes Gesicht jeden Tag, kein wechselndes Personal."
            />
            <Vorteil
              image="/images/allgemein/ruhige-atmosphaere.png"
              title="Ruhige Atmosphäre"
              text="Weniger Reize, mehr Geborgenheit – ein familiäres Zuhause auf Zeit."
            />
            <Vorteil
              image="/images/allgemein/sparschwein.png"
              title="Gleiche Kosten"
              text="Die Elternbeiträge sind identisch mit denen in Krippe und Kita."
            />
          </div>
        </div>
      </section>

      {/* 3 — Kontakt-CTA */}
      <section className="bg-creme">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="rounded-3xl bg-white p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Lerne Dresdens Tageseltern kennen
            </h2>
            <p className="text-text-soft text-lg max-w-2xl mx-auto mb-8">
              Finde Tageseltern in deiner Nähe mit freien Plätzen – oder melde
              dich direkt bei uns. Wir beraten dich gern und unverbindlich.
            </p>
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
              <LinkButton variant="primary" href="/kindertagespflege-finden">
                Tageseltern finden
              </LinkButton>
              <a
                href={`tel:${TELEFON}`}
                className="inline-flex items-center justify-center rounded-full bg-sonnengelb text-text px-6 py-3 font-semibold transition-colors hover:bg-sonnengelb-hell"
              >
                Anrufen: {TELEFON_ANZEIGE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center rounded-full bg-white text-text border border-text/10 px-6 py-3 font-semibold transition-colors hover:border-text/30"
              >
                E-Mail schreiben
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Vorteil({
  image,
  title,
  text,
}: {
  image: string;
  title: string;
  text: string;
}) {
  return (
    <Card className="flex flex-col gap-4 h-full overflow-hidden">
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
      <h3 className="font-bold text-lg hyphens-none">{title}</h3>
      <p className="text-text-soft text-sm flex-1">{text}</p>
    </Card>
  );
}
