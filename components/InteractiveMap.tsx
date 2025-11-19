'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon with better styling
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #047857 0%, #10b981 100%);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            style="transform: rotate(45deg);"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const InteractiveMap = () => {
  const [isClient, setIsClient] = useState(false);

  // INSEA coordinates in Rabat (more precise)
  const inseaPosition: [number, number] = [33.9776, -6.8498];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-emerald-100 flex items-center justify-center min-h-[400px]">
        <div className="text-emerald-800 font-medium">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={inseaPosition}
      zoom={16}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-full h-full min-h-[400px] z-0"
      style={{ height: '100%', minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <ZoomControl position="topright" />
      <Marker position={inseaPosition} icon={createCustomIcon()}>
        <Popup className="custom-popup">
          <div className="p-2 min-w-[200px]">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">
              Forum Génie Entreprise
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">INSEA</p>
              <p>Avenue Allal Ben Abdellah</p>
              <p>Rabat, Maroc</p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${inseaPosition[0]},${inseaPosition[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-medium text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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
