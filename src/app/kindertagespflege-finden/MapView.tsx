"use client";

// Diese Komponente läuft NUR im Browser (in FinderClient mit ssr:false geladen).
// Leaflet greift global auf `window` zu, deshalb darf sie nicht auf dem Server gerendert werden.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { PIN_FARBE } from "@/types";
import { PreviewCard } from "./PreviewCard";

const DRESDEN_ZENTRUM: [number, number] = [51.0504, 13.7373];
const DRESDEN_ZOOM = 12;

function pinIcon(farbe: string, ausgewaehlt: boolean): L.DivIcon {
  const groesse = ausgewaehlt ? 32 : 26;
  const border = ausgewaehlt ? "3px solid #fff" : "2px solid #fff";
  const shadow = ausgewaehlt
    ? "0 4px 12px rgba(0,0,0,0.35)"
    : "0 2px 6px rgba(0,0,0,0.25)";
  return L.divIcon({
    className: "tm-pin",
    html: `<div style="
        width:${groesse}px;
        height:${groesse}px;
        background:${farbe};
        border:${border};
        border-radius:50%;
        box-shadow:${shadow};
      "></div>`,
    iconSize: [groesse, groesse],
    iconAnchor: [groesse / 2, groesse / 2],
  });
}

type Props = {
  tagesmuetter: TagesmutterDto[];
  onSelect: (tm: TagesmutterDto) => void;
  ausgewaehlteId: string | null;
};

export function MapView({ tagesmuetter, onSelect, ausgewaehlteId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Vorschau-State (Hover Desktop / 1. Klick Mobile)
  const [vorschau, setVorschau] = useState<{
    tm: TagesmutterDto;
    x: number;
    y: number;
  } | null>(null);

  // Karte initialisieren (einmal)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: DRESDEN_ZENTRUM,
      zoom: DRESDEN_ZOOM,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Marker synchronisieren
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const benoetigt = new Set(tagesmuetter.map((t) => t.id));

    // Entfernen, was nicht mehr in der Liste ist
    for (const [id, marker] of markersRef.current) {
      if (!benoetigt.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Hinzufügen oder Icon aktualisieren
    for (const tm of tagesmuetter) {
      if (tm.latitude === null || tm.longitude === null) continue;
      const farbe = PIN_FARBE[tm.beratungsgebiet];
      const ausgewaehlt = tm.id === ausgewaehlteId;
      const icon = pinIcon(farbe, ausgewaehlt);

      const vorhanden = markersRef.current.get(tm.id);
      if (vorhanden) {
        vorhanden.setIcon(icon);
        continue;
      }

      const marker = L.marker([tm.latitude, tm.longitude], { icon });

      let touched = false;
      marker.on("mouseover", (e) => {
        const point = map.latLngToContainerPoint(e.latlng);
        setVorschau({ tm, x: point.x, y: point.y });
      });
      marker.on("mouseout", () => {
        if (!touched) setVorschau(null);
      });
      marker.on("click", () => {
        // Mobile: erster Tap = Vorschau, zweiter Tap = Profil öffnen
        const istTouch = window.matchMedia("(hover: none)").matches;
        if (istTouch) {
          if (vorschau?.tm.id === tm.id) {
            onSelect(tm);
            setVorschau(null);
          } else {
            const point = map.latLngToContainerPoint(marker.getLatLng());
            touched = true;
            setVorschau({ tm, x: point.x, y: point.y });
            setTimeout(() => {
              touched = false;
            }, 50);
          }
        } else {
          onSelect(tm);
          setVorschau(null);
        }
      });

      marker.addTo(map);
      markersRef.current.set(tm.id, marker);
    }
  }, [tagesmuetter, ausgewaehlteId, onSelect, vorschau]);

  // Karte schließen, wenn man auf den Hintergrund klickt
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = () => setVorschau(null);
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {vorschau && (
        <PreviewCard
          tagesmutter={vorschau.tm}
          x={vorschau.x}
          y={vorschau.y}
          onClick={() => {
            onSelect(vorschau.tm);
            setVorschau(null);
          }}
        />
      )}
    </div>
  );
}
