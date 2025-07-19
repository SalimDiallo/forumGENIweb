// components/UpcomingEvents.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Forum GENI Entreprises 2025",
      date: "3-5 mai 2025",
      location: "INSEA Rabat",
      description: "Notre événement phare annuel réunissant experts, étudiants et professionnels du secteur pour trois jours de conférences, ateliers et networking.",
      image: "/insea-building.jpg",
      link: "/evenements/forum-2025"
    },
    {
      id: 2,
      title: "Semin Marathon de l'Innovation",
      date: "15 juin 2025",
      location: "INSEA Rabat",
      description: "Un marathon sportif et innovant pour stimuler la créativité et l'esprit d'équipe. Rejoignez-nous pour une journée de défis et de découvertes.",
      image: "/insea-building.jpg",
      link: "/evenements/journee-carrieres-tech"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
              À venir
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Nos prochains événements
          </h2>
          <p className="text-lg text-green-700/80 max-w-2xl mx-auto">
            Découvrez les opportunités pour rencontrer notre communauté et développer votre réseau professionnel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden border border-green-100  transition-all"
            >
              <div className="relative h-56">
                <Image 
                  src={event.image} 
                  alt={event.title}
                  width={600}
                  height={500}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-green-800 font-medium text-sm">
                  <Calendar size={16} />
                  {event.date}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-green-800 font-medium text-sm">
                  <MapPin size={16} />
                  {event.location}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-green-900 mb-3">{event.title}</h3>
                <p className="text-green-700/80 mb-6">{event.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Users size={16} />
                    <span>Places limitées</span>
                  </div>
                  
                  <Link href={event.link}>
                    <motion.button 
                      className="py-2 px-4 bg-green-800 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex items-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Détails
                      <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/evenements">
            <motion.button 
              className="py-3 px-6 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition-all flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Voir tous nos événements
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;