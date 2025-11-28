'use client';

import React, { useState, useEffect } from 'react';
import SponsorsGrid from '@/components/SponsorsGrid';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface SponsorsPreviewProps {
  jsonValue: string;
}

const SponsorsPreview = ({ jsonValue }: SponsorsPreviewProps) => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!jsonValue || !jsonValue.trim()) {
      setSponsors([]);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        setSponsors(parsed);
        setError(null);
      } else {
        setError('Le JSON doit être un tableau');
        setSponsors([]);
      }
    } catch (err) {
      setError('JSON invalide - vérifiez la syntaxe');
      setSponsors([]);
    }
  }, [jsonValue]);

  if (!jsonValue || !jsonValue.trim()) {
    return null;
  }

  return (
    <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700 flex items-center gap-2">
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Prévisualisation des sponsors
        </span>
        <span className="text-sm text-gray-500">
          {sponsors.length} sponsor(s)
        </span>
      </button>

      {isVisible && (
        <div className="p-4 bg-white">
          {error ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Erreur de format</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : sponsors.length > 0 ? (
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg">
              <SponsorsGrid sponsors={sponsors} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun sponsor à afficher
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorsPreview;
