'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Improved custom marker icon: better accessibility and simpler styling
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;" aria-label="Localisation INSEA">
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #059669 0%, #34d399 100%);
          border: 3px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 16px rgba(4,120,87,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="white"
            style="transform: rotate(45deg);"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  });
};

const InteractiveMap = () => {
  const [isClient, setIsClient] = useState(false);

  // INSEA coordinates in Rabat (precise)
  const inseaPosition: [number, number] = [33.9776, -6.8498];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-emerald-100 flex items-center justify-center min-h-[400px]">
        <div className="text-emerald-800 font-medium" role="status" aria-label="Chargement de la carte">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={inseaPosition}
      zoom={17}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full min-h-[400px] z-0 rounded-b-lg"
      style={{ height: '100%', minHeight: '400px' }}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <ZoomControl position="topright" />
      <Marker position={inseaPosition} icon={createCustomIcon()}>
        <Popup className="custom-popup" closeButton>
          <div className="p-2 min-w-[210px]">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">
              Forum GENIEntreprise
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">INSEA - Institut National de Statistique et d'Économie Appliquée</p>
              <p className="italic">Avenue Allal Ben Abdellah</p>
              <p>Rabat, Maroc</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${inseaPosition[0]},${inseaPosition[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-medium text-sm flex items-center gap-1 transition-colors"
                aria-label="Itinéraire Google Maps vers INSEA"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.197-4.197M7 14a5 5 0 107-7l-7 7z" />
                </svg>
                Obtenir l'itinéraire
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default InteractiveMap;
