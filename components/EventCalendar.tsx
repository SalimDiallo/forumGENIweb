'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';

const EventCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const events = [
    {
      id: 1,
      title: "Forum GENI Entreprises 2025",
      date: "2025-05-03",
      endDate: "2025-05-05",
      time: "09:00",
      location: "INSEA Rabat",
      type: "Forum",
      participants: 500,
      description: "17ème édition de notre forum annuel",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Atelier Innovation Digitale",
      date: "2025-03-15",
      time: "14:00",
      location: "INSEA Rabat",
      type: "Atelier",
      participants: 50,
      description: "Workshop sur les dernières tendances digitales",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Conférence IA & Entreprise",
      date: "2025-04-20",
      time: "10:00",
      location: "Online",
      type: "Conférence",
      participants: 200,
      description: "Impact de l'IA sur l'entreprise moderne",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Networking Alumni",
      date: "2025-02-28",
      time: "18:00",
      location: "Casablanca",
      type: "Networking",
      participants: 80,
      description: "Soirée networking pour les anciens participants",
      status: "upcoming"
    }
  ];

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getEventTypeColor = (type: string) => {
    const colors = {
      'Forum': 'bg-green-100 text-green-800 border-green-200',
      'Atelier': 'bg-blue-100 text-blue-800 border-blue-200',
      'Conférence': 'bg-purple-100 text-purple-800 border-purple-200',
      'Networking': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
  });

  return (
    <section
      className="relative py-24 md:py-28"
      style={{
        backgroundImage: "url('/event.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/80 via-white/70 to-white/90 pointer-events-none z-0 backdrop-blur-md" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow mb-4">
            <Calendar className="w-4 h-4" />
            <span className="font-semibold">Événements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-500 to-emerald-400 mb-4">
            Calendrier des Événements
          </h1>
          <p className="text-xl text-emerald-800/80 max-w-3xl mx-auto">
            Découvrez tous nos événements à venir et ne manquez aucune opportunité de networking
          </p>
        </div>

        {/* Sélecteur de mois/année */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-5 py-3 border border-emerald-200 rounded-3xl bg-white shadow-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-emerald-800 font-semibold text-base"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-5 py-3 border border-emerald-200 rounded-3xl bg-white shadow-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-emerald-800 font-semibold text-base"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        {/* Liste des événements */}
        <div className="space-y-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-white/60 backdrop-blur-xl border border-emerald-100 rounded-3xl shadow-2xl hover:shadow-emerald-300/40 transition-all p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8 group hover:scale-[1.025] duration-300"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-4 py-1 rounded-2xl text-xs font-bold border ${getEventTypeColor(event.type)} shadow-sm tracking-wide`}>
                      {event.type}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900 tracking-tight leading-tight">{event.title}</h3>
                  </div>
                  <p className="text-emerald-800/80 mb-4 text-base md:text-lg leading-relaxed">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-6 text-emerald-700 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-emerald-500" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {event.endDate && event.endDate !== event.date && (
                        <span> - {new Date(event.endDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long'
                        })}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-blue-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-orange-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-purple-500" />
                      {event.participants} participants
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 md:items-end mt-4 md:mt-0 w-full md:w-auto">
                  <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-3xl font-semibold shadow-lg hover:scale-105 hover:shadow-emerald-400/30 transition flex items-center justify-center gap-2 text-base md:text-lg">
                    S'inscrire <Plus size={20} />
                  </button>
                  <button className="w-full md:w-auto px-8 py-2 border border-emerald-200 text-emerald-700 rounded-3xl font-medium hover:bg-emerald-50 hover:shadow-md transition flex items-center justify-center gap-2 text-base">
                    Plus d'infos
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24">
              <Calendar className="text-emerald-200 mx-auto mb-4" size={72} />
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                Aucun événement prévu
              </h3>
              <p className="text-emerald-700/80">
                Aucun événement n'est planifié pour {months[selectedMonth]} {selectedYear}
              </p>
            </div>
          )}
        </div>

        {/* CTA pour proposer un événement */}
        <div className="text-center mt-24">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-500 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-extrabold mb-4">
              Vous souhaitez organiser un événement ?
            </h3>
            <p className="text-emerald-100 mb-8 text-lg">
              Proposez votre atelier, conférence ou session de networking à notre communauté
            </p>
            <button className="inline-flex items-center gap-2 px-10 py-4 bg-white text-emerald-700 rounded-3xl font-bold hover:bg-emerald-50 transition text-lg shadow-lg text-center">
              <Plus size={24} />
              Proposer un événement
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

EventCalendar.displayName = 'EventCalendar';

export default EventCalendar;
