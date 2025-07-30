'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
            <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
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
              className="bg-white rounded-xl p-6 border border-green-100 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                {info.title}
              </h3>
              <p className="text-green-800 font-medium mb-1">
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
          className="bg-white rounded-xl overflow-hidden border border-green-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                Venez nous rencontrer
              </h2>
              <div className="space-y-4 text-black/80">
                <p>
                  Notre équipe est basée au cœur de l'INSEA à Rabat, dans un environnement 
                  propice à l'innovation et à l'excellence académique.
                </p>
                <p>
                  Que vous soyez étudiant, entrepreneur, ou représentant d'entreprise, 
                  nos portes sont ouvertes pour discuter de collaborations et d'opportunités.
                </p>
                <div className="pt-4">
                  <h3 className="font-semibold text-black mb-2">Transports</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Tramway : Arrêt INSEA</li>
                    <li>• Bus : Lignes 12, 23, 45</li>
                    <li>• Parking gratuit disponible</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-green-100 flex items-center justify-center p-8">
              {/* Ici vous pourriez intégrer une vraie carte Google Maps */}
              <div className="w-full h-64 bg-green-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-black mx-auto mb-2" size={32} />
                  <p className="text-green-800 font-medium">Carte interactive</p>
                  <p className="text-black text-sm">INSEA, Rabat</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
