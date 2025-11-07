// components/UpcomingEvents.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Clock, Award } from 'lucide-react';

type EventData = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  featuredImage: string | null;
  eventType: string;
  location: string | null;
  isVirtual: boolean;
  startDate: Date;
  endDate: Date;
  maxParticipants: number | null;
  currentParticipants: number;
  isFeatured: boolean;
  _count: {
    registrations: number;
  };
};

type UpcomingEventsProps = {
  events: EventData[];
};

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  // Helper to validate image URL
  const getValidImageUrl = (url: string | null): string => {
    if (!url || url.trim() === '' || url === 'image') {
      return '/insea-building.jpg';
    }

    // Check if it's a valid absolute path
    if (url.startsWith('/')) {
      return url;
    }

    // Check if it's a valid URL
    try {
      new URL(url);
      return url;
    } catch {
      return '/insea-building.jpg';
    }
  };

  // Transform database events to display format
  const displayEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.startDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    time: `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    location: event.isVirtual ? 'En ligne' : (event.location || 'À définir'),
    type: event.eventType === 'forum' ? 'Forum' :
          event.eventType === 'workshop' ? 'Atelier' :
          event.eventType === 'conference' ? 'Conférence' :
          event.eventType === 'networking' ? 'Networking' :
          event.eventType === 'webinar' ? 'Webinaire' : 'Autre',
    priority: event.isFeatured ? 'high' : 'medium',
    description: event.shortDescription || event.description || '',
    image: getValidImageUrl(event.featuredImage),
    link: `/evenements/${event.slug}`,
    attendees: event.maxParticipants ? `${event.currentParticipants}/${event.maxParticipants}` : `${event.currentParticipants}+`,
    companies: event._count.registrations > 0 ? `${event._count.registrations}` : '0',
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Forum': return <Award size={14} />;
      case 'Compétition': return <Users size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-100 rounded-full mb-6 border border-emerald-200/50">
            <div className="w-2 h-2 bg-emerald-700 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
              Agenda 2025
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
            Événements d'Excellence
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Rejoignez les moments forts de notre communauté d'ingénieurs. 
            Networking premium, expertise technique et opportunités de carrière.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={event.image} 
                  alt={event.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(event.priority)}`}>
                    {event.type}
                  </div>
                </div>
                
                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-800 font-medium text-sm">
                      <Calendar size={16} className="text-emerald-800" />
                      {event.date}
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-800 font-medium text-sm">
                      <Clock size={16} className="text-emerald-800" />
                      {event.time}
                    </div>
                  </div>
                  
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 text-slate-800 font-medium text-sm">
                    <MapPin size={16} className="text-red-600" />
                    {event.location}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-800 leading-tight group-hover:text-emerald-800 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-800 ml-4 flex-shrink-0">
                    {getTypeIcon(event.type)}
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {event.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} className="text-emerald-700" />
                    <span className="font-medium">{event.attendees} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award size={16} className="text-emerald-700" />
                    <span className="font-medium">{event.companies} entreprises</span>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Inscription requise</span>
                  </div>
                  
                  <Link href={event.link}>
                    <motion.button 
                      className="group/btn px-6 py-3 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      En savoir plus
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl p-8 border border-slate-200/50"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Ne manquez aucun événement
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Explorez notre calendrier complet et inscrivez-vous aux événements qui façonneront votre parcours professionnel.
          </p>
          
          <Link href="/evenements">
            <motion.button 
              className="group/main px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Découvrir tous nos événements
              <ArrowRight size={20} className="group-hover/main:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;