'use client';

import React from 'react';

const SimpleEvents = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
            Calendrier des Événements
          </h1>
          <p className="text-xl text-emerald-700/80 max-w-3xl mx-auto">
            Découvrez tous nos événements à venir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Forum GENI INSEA 2025</h3>
            <p className="text-emerald-600 mb-2">3-5 Mai 2025</p>
            <p className="text-gray-600">INSEA Rabat</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Atelier Innovation</h3>
            <p className="text-emerald-600 mb-2">15 Mars 2025</p>
            <p className="text-gray-600">INSEA Rabat</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Conférence IA</h3>
            <p className="text-emerald-600 mb-2">20 Avril 2025</p>
            <p className="text-gray-600">En ligne</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleEvents;
