"use client";

// Diese Komponente läuft NUR im Browser (in FinderClient mit ssr:false geladen).
// Leaflet greift global auf `window` zu, deshalb darf sie nicht auf dem Server gerendert werden.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { BERATUNGSSTELLE_URL, PIN_BERATUNGSSTELLE, type Beratungsgebiet } from "@/types";
import { BERATUNGSSTELLEN } from "./beratungsstellen";
import { PreviewCard } from "./PreviewCard";

// leaflet-gesture-handling registriert sich beim Import selbst via L.Map.addInitHook.
// Kein manueller addInitHook nötig — der doppelte Aufruf bricht Touch-Geräte.

const DRESDEN_ZENTRUM: [number, number] = [51.0504, 13.7373];
const DRESDEN_ZOOM_DESKTOP = 12;
const DRESDEN_ZOOM_MOBILE = 11;

// Eng zugeschnittenes Pin-Bild (transparenter Rand entfernt), damit das
// Treffer-Rechteck dicht am sichtbaren Pin sitzt. Seitenverhältnis 455/676.
const PIN_TM_TRIM = "/images/pins/tagesmutter-trim.png";
const PIN_RATIO = 455 / 676;

// Höhe → Breite passend zum Seitenverhältnis des zugeschnittenen Bildes.
function pinMasse(ausgewaehlt: boolean): { w: number; h: number } {
  const h = ausgewaehlt ? 56 : 42;
  return { w: Math.round(h * PIN_RATIO), h };
}

function pinIcon(ausgewaehlt: boolean): L.Icon {
  const { w, h } = pinMasse(ausgewaehlt);
  return L.icon({
    iconUrl: PIN_TM_TRIM,
    iconSize: [w, h],
    iconAnchor: [w / 2, h], // Pin-Spitze unten
    className: ausgewaehlt ? "tm-pin tm-pin-aktiv" : "tm-pin",
  });
}

function stackIcon(anzahl: number, ausgewaehlt: boolean): L.DivIcon {
  const { w, h } = pinMasse(ausgewaehlt);
  return L.divIcon({
    html: `<div style="position:relative;width:${w}px;height:${h}px">
      <img src="${PIN_TM_TRIM}" style="width:100%;height:100%;display:block" />
      <span style="
        position:absolute;top:-2px;right:-6px;
        background:#c0392b;color:white;
        font-size:11px;font-weight:700;line-height:1;
        min-width:19px;height:19px;padding:0 4px;
        border-radius:10px;
        display:flex;align-items:center;justify-content:center;
        border:2px solid white;
        box-shadow:0 1px 4px rgba(0,0,0,0.4);
        font-family:system-ui,sans-serif;
        box-sizing:border-box;
      ">${anzahl}</span>
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    className: ausgewaehlt ? "tm-pin tm-pin-aktiv" : "tm-pin",
  });
}

function erstelleAuswahlPopup(
  gruppe: TagesmutterDto[],
  onAuswaehlen: (tm: TagesmutterDto) => void,
): L.Popup {
  const popup = L.popup({
    closeButton: true,
    offset: [0, -10] as [number, number],
    autoPan: true,
    maxWidth: 250,
  });

  const html = `
    <div style="padding:2px 0">
      <p style="font-weight:700;font-size:12px;color:#888;margin:0 0 8px;font-family:system-ui,sans-serif">
        ${gruppe.length} Tageseltern an dieser Adresse
      </p>
      ${gruppe
        .map(
          (tm, i) => `
        <button data-idx="${i}" style="
          display:block;width:100%;text-align:left;
          padding:8px 10px;margin:3px 0;
          border:1px solid #e8dfc8;background:#fdf7e3;
          border-radius:8px;cursor:pointer;
          font-size:13px;font-weight:600;color:#333;
          font-family:system-ui,sans-serif;
        ">${tm.vorname} ${tm.nachname}</button>
      `,
        )
        .join("")}
    </div>
  `;

  popup.setContent(html);

  popup.on("add", () => {
    const el = popup.getElement();
    if (!el) return;
    el.querySelectorAll<HTMLButtonElement>("button[data-idx]").forEach((btn) => {
      btn.addEventListener("mouseover", () => {
        btn.style.background = "#f8796c";
        btn.style.color = "white";
        btn.style.borderColor = "#f8796c";
      });
      btn.addEventListener("mouseout", () => {
        btn.style.background = "#fdf7e3";
        btn.style.color = "#333";
        btn.style.borderColor = "#e8dfc8";
      });
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx ?? "0");
        onAuswaehlen(gruppe[idx]);
        popup.close();
      });
    });
  });

  return popup;
}

function beratungsstellenIcon(bild: string, hover: boolean): L.Icon {
  const groesse = hover ? 54 : 36;
  return L.icon({
    iconUrl: bild,
    iconSize: [groesse, groesse],
    iconAnchor: [groesse / 2, groesse],
    className: "tm-pin tm-pin-beratung",
  });
}

type Props = {
  tagesmuetter: TagesmutterDto[];
  onSelect: (tm: TagesmutterDto) => void;
  ausgewaehlteId: string | null;
  suchCoords: { lat: number; lng: number } | null;
  radiusKm: number;
  hoveredBeratungsstelle: Beratungsgebiet | null;
};

export function MapView({
  tagesmuetter,
  onSelect,
  ausgewaehlteId,
  suchCoords,
  radiusKm,
  hoveredBeratungsstelle,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const beratungsstellenMarkersRef = useRef<Map<Beratungsgebiet, L.Marker>>(new Map());
  const umkreisRef = useRef<L.Circle | null>(null);
  const suchMarkerRef = useRef<L.CircleMarker | null>(null);

  // Vorschau-State (Hover Desktop / 1. Klick Mobile)
  const [vorschau, setVorschau] = useState<{
    tm: TagesmutterDto;
    x: number;
    y: number;
    nachUnten: boolean;
  } | null>(null);

  // Karten-Bereitschaft signalisieren, damit nachfolgende Effekte erst
  // synchronisieren, wenn die Karte wirklich initialisiert ist.
  const [kartenBereit, setKartenBereit] = useState(false);

  // Karte initialisieren (einmal). In requestAnimationFrame verlegt,
  // damit Container-Layout sicher steht und Strict-Mode-Double-Mount
  // den ersten Init sauber abbrechen kann.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let abgebrochen = false;
    let map: L.Map | null = null;
    let sizeTimeoutId: number | null = null;

    const frameId = window.requestAnimationFrame(() => {
      if (abgebrochen || !containerRef.current) return;

      const istMobile = window.matchMedia("(max-width: 767px)").matches;
      map = L.map(containerRef.current, {
        center: DRESDEN_ZENTRUM,
        zoom: istMobile ? DRESDEN_ZOOM_MOBILE : DRESDEN_ZOOM_DESKTOP,
        scrollWheelZoom: false, // aktiviert sich nach erstem Klick in die Karte
        // Mobil: 1 Finger scrollt die Seite, 2 Finger verschieben/zoomen die Karte.
        // Desktop: Strg + Mausrad zum Zoomen.
        gestureHandling: istMobile,
        gestureHandlingOptions: {
          text: {
            touch: "Zum Verschieben zwei Finger benutzen",
            scroll: "Zum Zoomen Strg + Mausrad benutzen",
            scrollMac: "Zum Zoomen ⌘ + Mausrad benutzen",
          },
        },
      } as L.MapOptions);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // Auf Mobile berechnet Leaflet die Container-Größe manchmal zu früh
      // (bevor der Browser das Layout abgeschlossen hat). invalidateSize()
      // korrigiert das nach einem kurzen Tick.
      // sizeTimeoutId wird im Cleanup gecancelt, damit der Aufruf nicht
      // auf einer bereits zerstörten Karte landet (z. B. React-Strict-Mode-Doppel-Mount).
      sizeTimeoutId = window.setTimeout(() => {
        if (!abgebrochen) map?.invalidateSize();
      }, 300);

      // Beratungsstellen als feste Pins anlegen (ändern sich nicht).
      for (const stelle of BERATUNGSSTELLEN) {
        const icon = beratungsstellenIcon(PIN_BERATUNGSSTELLE[stelle.schluessel], false);
        const url = BERATUNGSSTELLE_URL[stelle.schluessel];

        // Popup statt Tooltip, damit der Link klickbar bleibt.
        // Der Timer verhindert, dass das Fenster schließt, während die Maus
        // die kurze Lücke zwischen Marker und Popup-Box überquert.
        let schliessTimer: ReturnType<typeof setTimeout> | null = null;

        const popup = L.popup({
          closeButton: false,
          offset: [0, -6] as [number, number],
          autoPan: false,
        }).setContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="beratung-popup-link">${stelle.name}</a>` +
            `<br><span class="beratung-popup-adresse">${stelle.strasse}, ${stelle.plz} Dresden</span>`,
        );

        const marker = L.marker([stelle.latitude, stelle.longitude], { icon }).addTo(map);
        marker.bindPopup(popup);

        marker.on("mouseover", () => {
          if (schliessTimer) clearTimeout(schliessTimer);
          marker.openPopup();
        });
        marker.on("mouseout", () => {
          schliessTimer = setTimeout(() => marker.closePopup(), 250);
        });

        // Wenn die Maus ins Popup gleitet → Timer abbrechen
        popup.on("add", () => {
          const el = popup.getElement();
          if (!el) return;
          el.addEventListener("mouseenter", () => {
            if (schliessTimer) clearTimeout(schliessTimer);
          });
          el.addEventListener("mouseleave", () => {
            schliessTimer = setTimeout(() => marker.closePopup(), 250);
          });
        });

        beratungsstellenMarkersRef.current.set(stelle.schluessel, marker);
      }

      mapRef.current = map;
      setKartenBereit(true);
    });

    return () => {
      abgebrochen = true;
      window.cancelAnimationFrame(frameId);
      if (sizeTimeoutId !== null) window.clearTimeout(sizeTimeoutId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      } else if (map) {
        map.remove();
      }
      markersRef.current.clear();
      setKartenBereit(false);
    };
  }, []);

  // Marker synchronisieren
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !kartenBereit) return;

    // Alle vorhandenen TM-Marker entfernen (Rebuild, da Gruppen sich ändern können)
    const bereitsEntfernt = new Set<L.Marker>();
    for (const marker of markersRef.current.values()) {
      if (!bereitsEntfernt.has(marker)) {
        marker.remove();
        bereitsEntfernt.add(marker);
      }
    }
    markersRef.current.clear();

    // Nach Koordinaten gruppieren
    const gruppen = new Map<string, TagesmutterDto[]>();
    for (const tm of tagesmuetter) {
      if (tm.latitude === null || tm.longitude === null) continue;
      const key = `${tm.latitude.toFixed(6)},${tm.longitude.toFixed(6)}`;
      if (!gruppen.has(key)) gruppen.set(key, []);
      gruppen.get(key)!.push(tm);
    }

    // Marker je Gruppe anlegen
    for (const gruppe of gruppen.values()) {
      const lat = gruppe[0].latitude!;
      const lng = gruppe[0].longitude!;
      const istStack = gruppe.length > 1;
      const enthaeltAusgewaehlt = gruppe.some((tm) => tm.id === ausgewaehlteId);

      if (istStack) {
        // ── Stack-Pin: Zahl-Badge + Auswahl-Popup ─────────────────────
        const icon = stackIcon(gruppe.length, enthaeltAusgewaehlt);
        const marker = L.marker([lat, lng], { icon });

        marker.on("click", () => {
          setVorschau(null);
          const popup = erstelleAuswahlPopup(gruppe, (tm) => {
            onSelect(tm);
          });
          marker.bindPopup(popup).openPopup();
        });

        marker.addTo(map);
        for (const tm of gruppe) {
          markersRef.current.set(tm.id, marker);
        }
      } else {
        // ── Einzelner Pin: bestehendes Verhalten ──────────────────────
        const tm = gruppe[0];
        const ausgewaehlt = tm.id === ausgewaehlteId;
        const icon = pinIcon(ausgewaehlt);
        const marker = L.marker([lat, lng], { icon });

        marker.on("mouseover", (e) => {
          if (!window.matchMedia("(hover: none)").matches) {
            const point = map.latLngToContainerPoint(e.latlng);
            // Oberhalb des Pins braucht die Karte ca. 200 px. Ist dort kein
            // Platz (Pin am oberen Rand), klappt sie nach unten auf.
            const nachUnten = point.y < 200;
            setVorschau({ tm, x: point.x, y: point.y, nachUnten });
          }
        });
        marker.on("mouseout", () => setVorschau(null));
        marker.on("click", () => {
          onSelect(tm);
          setVorschau(null);
        });

        marker.addTo(map);
        markersRef.current.set(tm.id, marker);
      }
    }
  }, [tagesmuetter, ausgewaehlteId, onSelect, kartenBereit]);

  // Umkreis-Kreis + Such-Marker synchronisieren
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !kartenBereit) return;

    if (!suchCoords) {
      umkreisRef.current?.remove();
      umkreisRef.current = null;
      suchMarkerRef.current?.remove();
      suchMarkerRef.current = null;
      return;
    }

    const center: [number, number] = [suchCoords.lat, suchCoords.lng];

    // Such-Marker (kleiner Punkt) immer setzen, sobald Coords da sind.
    if (!suchMarkerRef.current) {
      suchMarkerRef.current = L.circleMarker(center, {
        radius: 6,
        color: "#ff6b5b",
        weight: 2,
        fillColor: "#ff6b5b",
        fillOpacity: 1,
        interactive: false,
      }).addTo(map);
    } else {
      suchMarkerRef.current.setLatLng(center);
    }

    // Umkreis nur wenn radius > 0.
    if (radiusKm > 0) {
      const radiusMeter = radiusKm * 1000;
      if (!umkreisRef.current) {
        umkreisRef.current = L.circle(center, {
          radius: radiusMeter,
          color: "#ff6b5b",
          weight: 2,
          fillColor: "#ff6b5b",
          fillOpacity: 0.08,
          interactive: false,
        }).addTo(map);
      } else {
        umkreisRef.current.setLatLng(center);
        umkreisRef.current.setRadius(radiusMeter);
      }
    } else {
      umkreisRef.current?.remove();
      umkreisRef.current = null;
    }
  }, [suchCoords, radiusKm, kartenBereit]);

  // Beratungsstellen-Pin vergrößern beim Hover über den Link in der Legende
  useEffect(() => {
    for (const [schluessel, marker] of beratungsstellenMarkersRef.current) {
      const stelle = BERATUNGSSTELLEN.find((s) => s.schluessel === schluessel);
      if (!stelle) continue;
      const hover = schluessel === hoveredBeratungsstelle;
      marker.setIcon(beratungsstellenIcon(PIN_BERATUNGSSTELLE[schluessel], hover));
    }
  }, [hoveredBeratungsstelle]);

  // Karte schließen, wenn man auf den Hintergrund klickt.
  // Scroll-Zoom: nach Klick aktivieren, beim Verlassen der Karte wieder deaktivieren.
  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container || !kartenBereit) return;

    const handleClick = () => {
      setVorschau(null);
      map.scrollWheelZoom.enable();
    };
    const handleMouseLeave = () => {
      map.scrollWheelZoom.disable();
    };

    map.on("click", handleClick);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      map.off("click", handleClick);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [kartenBereit]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {vorschau && (
        <PreviewCard
          tagesmutter={vorschau.tm}
          x={vorschau.x}
          y={vorschau.y}
          nachUnten={vorschau.nachUnten}
          onClick={() => {
            onSelect(vorschau.tm);
            setVorschau(null);
          }}
        />
      )}
    </div>
  );
}
