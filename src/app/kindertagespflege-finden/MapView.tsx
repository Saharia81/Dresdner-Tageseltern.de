"use client";

// Diese Komponente läuft NUR im Browser (in FinderClient mit ssr:false geladen).
// Leaflet greift global auf `window` zu, deshalb darf sie nicht auf dem Server gerendert werden.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import type { TagesmutterDto } from "@/app/api/tagesmutters/route";
import { PIN_BERATUNGSSTELLE, PIN_TAGESMUTTER, type Beratungsgebiet } from "@/types";
import { BERATUNGSSTELLEN } from "./beratungsstellen";
import { PreviewCard } from "./PreviewCard";

// leaflet-gesture-handling registriert sich beim Import selbst via L.Map.addInitHook.
// Kein manueller addInitHook nötig — der doppelte Aufruf bricht Touch-Geräte.

const DRESDEN_ZENTRUM: [number, number] = [51.0504, 13.7373];
const DRESDEN_ZOOM_DESKTOP = 12;
const DRESDEN_ZOOM_MOBILE = 11;

function pinIcon(bild: string, ausgewaehlt: boolean): L.Icon {
  const groesse = ausgewaehlt ? 78 : 60;
  return L.icon({
    iconUrl: bild,
    iconSize: [groesse, groesse],
    iconAnchor: [groesse / 2, groesse], // Pin-Spitze unten
    className: ausgewaehlt ? "tm-pin tm-pin-aktiv" : "tm-pin",
  });
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

    const frameId = window.requestAnimationFrame(() => {
      if (abgebrochen || !containerRef.current) return;

      const istMobile = window.matchMedia("(max-width: 767px)").matches;
      map = L.map(containerRef.current, {
        center: DRESDEN_ZENTRUM,
        zoom: istMobile ? DRESDEN_ZOOM_MOBILE : DRESDEN_ZOOM_DESKTOP,
        scrollWheelZoom: false, // erst nach Klick aktivieren
        // @ts-expect-error – kommt vom leaflet-gesture-handling-Plugin
        gestureHandling: true,
        gestureHandlingOptions: {
          text: {
            touch: "Mit zwei Fingern die Karte bewegen",
            scroll: "Strg + Mausrad zum Zoomen",
            scrollMac: "⌘ + Mausrad zum Zoomen",
          },
        },
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // Beratungsstellen als feste Pins anlegen (ändern sich nicht).
      for (const stelle of BERATUNGSSTELLEN) {
        const icon = beratungsstellenIcon(PIN_BERATUNGSSTELLE[stelle.schluessel], false);
        const marker = L.marker([stelle.latitude, stelle.longitude], { icon })
          .addTo(map)
          .bindTooltip(
            `<strong>${stelle.name}</strong><br>${stelle.strasse}, ${stelle.plz} Dresden`,
            { direction: "top", offset: [0, -28] },
          );
        beratungsstellenMarkersRef.current.set(stelle.schluessel, marker);
      }

      mapRef.current = map;
      setKartenBereit(true);
    });

    return () => {
      abgebrochen = true;
      window.cancelAnimationFrame(frameId);
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
      const ausgewaehlt = tm.id === ausgewaehlteId;
      const icon = pinIcon(PIN_TAGESMUTTER, ausgewaehlt);

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
  }, [tagesmuetter, ausgewaehlteId, onSelect, vorschau, kartenBereit]);

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

  // Karte schließen, wenn man auf den Hintergrund klickt
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !kartenBereit) return;
    const handler = () => setVorschau(null);
    map.on("click", handler);
    return () => {
      map.off("click", handler);
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
          onClick={() => {
            onSelect(vorschau.tm);
            setVorschau(null);
          }}
        />
      )}
    </div>
  );
}
