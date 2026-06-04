// Einmalskript: gibt die Koordinaten der drei Beratungsstellen aus.
// Ausführung:  npx tsx scripts/geocode-beratungsstellen.ts

const STELLEN = [
  { name: "MALWINA", strasse: "Leipziger Straße 118", plz: "01127" },
  { name: "OUTLAW", strasse: "An der Pikardie 6", plz: "01277" },
  { name: "KINDERLAND", strasse: "Berggartenstraße 5", plz: "01309" },
];

async function geocode(strasse: string, plz: string) {
  const params = new URLSearchParams({
    street: strasse,
    postalcode: plz,
    city: "Dresden",
    country: "Germany",
    format: "json",
    limit: "1",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent":
          "DresdnerTageselternImport/1.0 (info@dresdner-tageseltern.de)",
      },
    },
  );
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

const wartezeit = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const s of STELLEN) {
    const c = await geocode(s.strasse, s.plz);
    if (c) {
      console.log(
        `  ${s.name}: ${c.lat.toFixed(5)}, ${c.lng.toFixed(5)} (${s.strasse}, ${s.plz})`,
      );
    } else {
      console.log(`  ${s.name}: NICHT GEFUNDEN (${s.strasse}, ${s.plz})`);
    }
    await wartezeit(1100);
  }
}

main();
