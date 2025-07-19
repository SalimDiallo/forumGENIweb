'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
              Événements
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Calendrier des Événements
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Découvrez tous nos événements à venir et ne manquez aucune opportunité de networking
          </p>
        </motion.div>

        {/* Sélecteur de mois/année */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </motion.div>

        {/* Liste des événements */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-green-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-green-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <p className="text-green-700/80 mb-4">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-green-700">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
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
                        <Clock size={16} />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        {event.participants} participants
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 lg:items-end">
                    <button className="px-6 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                      S'inscrire
                    </button>
                    <button className="px-6 py-2 border border-green-200 text-green-800 rounded-lg font-medium hover:bg-green-50 transition-colors">
                      Plus d'infos
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <Calendar className="text-green-300 mx-auto mb-4" size={64} />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Aucun événement prévu
              </h3>
              <p className="text-green-700/80">
                Aucun événement n'est planifié pour {months[selectedMonth]} {selectedYear}
              </p>
            </motion.div>
          )}
        </div>

        {/* CTA pour proposer un événement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-green-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Vous souhaitez organiser un événement ?
            </h3>
            <p className="text-green-200 mb-6">
              Proposez votre atelier, conférence ou session de networking à notre communauté
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-800 rounded-lg font-medium hover:bg-green-50 transition-colors">
              <Plus size={20} />
              Proposer un événement
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

EventCalendar.displayName = 'EventCalendar';

export default EventCalendar;
