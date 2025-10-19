"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

// Correction d’un bug d’icônes sous Next.js (sinon les marqueurs n’apparaissent pas)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const inseaPosition: LatLngExpression = [33.9716, -6.8663]; // Coordonnées INSEA Rabat

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={inseaPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={inseaPosition}>
          <Popup>
            <strong>INSEA Rabat</strong><br />
            Institut National de Statistique et d'Économie Appliquée<br />
            <a
              href="https://maps.app.goo.gl/YLRRB9tzy8CHWasf6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Voir sur Google Maps
            </a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
