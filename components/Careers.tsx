'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Users, Target } from 'lucide-react';

const Careers = () => {
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
              Carrières
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            Espace Carrières
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Connectez-vous avec les meilleures opportunités professionnelles grâce à notre réseau de partenaires
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <Briefcase className="text-green-600" size={32} />,
              title: "Offres d'emploi",
              description: "Découvrez les dernières opportunités chez nos partenaires"
            },
            {
              icon: <TrendingUp className="text-green-600" size={32} />,
              title: "Conseils carrière",
              description: "Guides et astuces pour booster votre développement professionnel"
            },
            {
              icon: <Users className="text-green-600" size={32} />,
              title: "Réseau alumni",
              description: "Connectez-vous avec notre communauté d'anciens participants"
            },
            {
              icon: <Target className="text-green-600" size={32} />,
              title: "Coaching",
              description: "Bénéficiez d'un accompagnement personnalisé"
            }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-green-100 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {service.title}
              </h3>
              <p className="text-green-700/80">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;
