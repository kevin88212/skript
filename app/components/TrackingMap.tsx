"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  riderLat: number;
  riderLng: number;
  destLat: number;
  destLng: number;
}

declare global {
  interface Window {
    mapboxgl: {
      Map: new (opts: object) => MapInstance;
      Marker: new (opts?: object) => MarkerInstance;
      LngLatBounds: new () => BoundsInstance;
      accessToken: string;
    };
  }
}

interface MapInstance {
  on: (event: string, cb: () => void) => void;
  remove: () => void;
  fitBounds: (bounds: BoundsInstance, opts: object) => void;
}
interface MarkerInstance {
  setLngLat: (coords: [number, number]) => MarkerInstance;
  addTo: (map: MapInstance) => MarkerInstance;
  getElement: () => HTMLElement;
}
interface BoundsInstance {
  extend: (coords: [number, number]) => BoundsInstance;
}

export default function TrackingMap({ riderLat, riderLng, destLat, destLng }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const riderMarkerRef = useRef<MarkerInstance | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || token.startsWith("pk.dein") || !mapContainer.current) {
      setMapError(true);
      return;
    }

    // Load Mapbox GL JS from CDN
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js";
    script.onload = () => initMap();
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
    document.head.appendChild(link);

    return () => {
      mapRef.current?.remove();
    };
  }, [token]);

  const initMap = () => {
    if (!mapContainer.current || !window.mapboxgl) return;

    window.mapboxgl.accessToken = token!;

    const map = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [riderLng, riderLat],
      zoom: 14,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);

      // Rider marker
      const riderEl = document.createElement("div");
      riderEl.className = "rider-marker";
      riderEl.innerHTML = `<div style="
        width:44px;height:44px;background:linear-gradient(135deg,#22D470,#FFD23F);
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:22px;box-shadow:0 0 20px rgba(255,107,53,0.6);
        border:2px solid white;
      ">🛵</div>`;

      const riderMarker = new window.mapboxgl.Marker({ element: riderEl });
      riderMarker.setLngLat([riderLng, riderLat]).addTo(map);
      riderMarkerRef.current = riderMarker;

      // Destination marker
      const destEl = document.createElement("div");
      destEl.innerHTML = `<div style="
        width:44px;height:44px;background:#06D6A0;
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:22px;box-shadow:0 0 20px rgba(6,214,160,0.6);
        border:2px solid white;
      ">🏠</div>`;
      new window.mapboxgl.Marker({ element: destEl })
        .setLngLat([destLng, destLat])
        .addTo(map);

      // Fit bounds
      const bounds = new window.mapboxgl.LngLatBounds();
      bounds.extend([riderLng, riderLat]);
      bounds.extend([destLng, destLat]);
      map.fitBounds(bounds, { padding: 80 });
    });
  };

  // Update rider position
  useEffect(() => {
    if (riderMarkerRef.current && mapLoaded) {
      riderMarkerRef.current.setLngLat([riderLng, riderLat]);
    }
  }, [riderLat, riderLng, mapLoaded]);

  if (mapError) {
    return <FallbackMap riderLat={riderLat} riderLng={riderLng} />;
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center glass">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#22D470]/30 border-t-[#22D470] rounded-full animate-spin" />
            <span className="text-white/60 text-sm">Karte wird geladen…</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FallbackMap({ riderLat, riderLng }: { riderLat: number; riderLng: number }) {
  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0F3460, #16213E)",
        backgroundImage: `
          linear-gradient(rgba(255,107,53,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,107,53,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300" preserveAspectRatio="none">
        <path d="M0,150 Q100,100 200,150 T400,150" stroke="#22D470" strokeWidth="3" fill="none" />
        <path d="M200,0 Q180,100 200,150 Q220,200 200,300" stroke="#FFD23F" strokeWidth="2" fill="none" />
        <path d="M0,80 L400,80" stroke="white" strokeWidth="0.5" />
        <path d="M0,220 L400,220" stroke="white" strokeWidth="0.5" />
        <path d="M100,0 L100,300" stroke="white" strokeWidth="0.5" />
        <path d="M300,0 L300,300" stroke="white" strokeWidth="0.5" />
      </svg>

      {/* Animated rider */}
      <div
        className="absolute transition-all duration-1000"
        style={{
          left: `${20 + (riderLat % 20)}%`,
          top: `${55 + (riderLng % 15)}%`,
        }}
      >
        <div className="relative">
          <div className="w-11 h-11 bg-[#1A1A2E] border-2 border-[#22D470] rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce">
            🛵
          </div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass rounded-lg px-2 py-1 text-xs text-[#22D470] font-bold">
            Max K.
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="absolute top-[15%] right-[20%]">
        <div className="w-11 h-11 bg-[#06D6A0]/20 border-2 border-[#06D6A0] rounded-full flex items-center justify-center text-xl shadow-xl">
          🏠
        </div>
      </div>

      {/* Token hint */}
      <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl px-4 py-2 text-center">
        <p className="text-white/40 text-xs">
          Füge <span className="text-[#FFD23F]">NEXT_PUBLIC_MAPBOX_TOKEN</span> in .env.local ein für die echte Karte
        </p>
      </div>
    </div>
  );
}
