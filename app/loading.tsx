import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-green-800 mb-2">Forum GENI INSEA</h2>
        <p className="text-green-600">Chargement en cours...</p>
      </div>
    </div>
  );
}
