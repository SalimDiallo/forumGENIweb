'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Target, Heart, Lightbulb } from 'lucide-react';

const Mission = () => {
  const values = [
    {
      icon: <Target className="text-green-600" size={32} />,
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous entreprenons, en nous appuyant sur les meilleurs talents et pratiques."
    },
    {
      icon: <Lightbulb className="text-green-600" size={32} />,
      title: "Innovation",
      description: "Nous encourageons la créativité et l'innovation pour construire l'économie de demain."
    },
    {
      icon: <Heart className="text-green-600" size={32} />,
      title: "Solidarité",
      description: "Nous croyons en la force du collectif et en l'importance de l'entraide pour réussir ensemble."
    },
    {
      icon: <Eye className="text-green-600" size={32} />,
      title: "Vision",
      description: "Nous gardons toujours en vue l'objectif d'un impact positif sur la société et l'économie."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-green-50 rounded-xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-green-600" size={36} />
              <h2 className="text-3xl font-bold text-green-900">Notre Mission</h2>
            </div>
            <p className="text-lg text-green-700/80 leading-relaxed">
              Connecter l'excellence académique de l'INSEA avec les leaders du monde professionnel 
              pour créer un écosystème d'innovation et d'entrepreneuriat qui façonne les leaders 
              de demain et contribue au développement économique durable du Maroc et de l'Afrique.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-green-800 rounded-xl p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye className="text-green-200" size={36} />
              <h2 className="text-3xl font-bold">Notre Vision</h2>
            </div>
            <p className="text-lg text-green-200 leading-relaxed">
              Être la plateforme de référence qui unit l'expertise académique et l'innovation 
              entrepreneuriale, créant un impact positif et durable sur le développement 
              économique et social de notre région.
            </p>
          </motion.div>
        </div>

        {/* Valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Nos Valeurs
          </h2>
          <p className="text-lg text-green-700/80 max-w-2xl mx-auto">
            Les principes fondamentaux qui guident nos actions et notre engagement quotidien
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-green-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {value.title}
              </h3>
              <p className="text-green-700/80 text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
