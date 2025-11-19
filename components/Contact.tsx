'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
      <div className="text-emerald-800">Chargement de la carte...</div>
    </div>
  ),
});

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-black" size={24} />,
      title: "Email",
      details: "contact@forumgenieentreprises.ma",
      description: "Écrivez-nous pour toute question"
    },
    {
      icon: <Phone className="text-black" size={24} />,
      title: "Téléphone",
      details: "+212 5 37 77 48 90",
      description: "Lun-Ven de 9h à 18h"
    },
    {
      icon: <MapPin className="text-black" size={24} />,
      title: "Adresse",
      details: "INSEA, Avenue Allal Ben Abdellah",
      description: "Rabat, Maroc"
    },
    {
      icon: <Clock className="text-black" size={24} />,
      title: "Horaires",
      details: "Lundi - Vendredi",
      description: "9h00 - 18h00"
    }
  ];

  return (
    <section className="pb-20 pt-10 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center p-1 bg-emerald-100  mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-emerald-800 text-white ">
              Contact
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-black/80 max-w-3xl mx-auto">
            Nous sommes là pour répondre à vos questions et vous accompagner dans vos projets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white  p-6 border border-emerald-100 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                {info.title}
              </h3>
              <p className="text-emerald-800 font-medium mb-1">
                {info.details}
              </p>
              <p className="text-black/80 text-sm">
                {info.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Carte et informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white overflow-hidden border border-emerald-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-black mb-6">
                Venez nous rencontrer
              </h2>
              <div className="space-y-4 text-black/80">
                <p className="text-lg">
                  Notre équipe est basée au cœur de l'<span className="font-semibold text-emerald-800">INSEA</span> à Rabat, dans un environnement
                  propice à l'innovation et à l'excellence académique.
                </p>
                <p>
                  Que vous soyez étudiant, entrepreneur, ou représentant d'entreprise,
                  nos portes sont ouvertes pour discuter de collaborations et d'opportunités.
                </p>
                <div className="pt-4 bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Comment s'y rendre
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>Tramway :</strong> Arrêt INSEA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>Bus :</strong> Lignes 12, 23, 45</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span><strong>Parking :</strong> Gratuit sur place</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-auto">
              <InteractiveMap />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
