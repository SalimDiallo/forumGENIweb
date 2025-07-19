'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, Target } from 'lucide-react';

const About = () => {
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
              Notre Histoire
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            À Propos du Forum GENI INSEA
          </h1>
          <p className="text-xl text-green-700/80 max-w-3xl mx-auto">
            Depuis 2002, nous connectons l'excellence académique de l'INSEA avec les leaders du monde professionnel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-green-900 mb-6">
              Notre Histoire
            </h2>
            <div className="space-y-4 text-green-700/80">
              <p>
                Fondé en 2002 par des étudiants visionnaires de l'INSEA, le Forum GENI INSEA 
                est né d'une ambition simple : créer un pont durable entre l'excellence académique 
                et l'innovation entrepreneuriale.
              </p>
              <p>
                Au fil des années, nous avons rassemblé plus de 500 experts, entrepreneurs et 
                décideurs qui partagent notre vision d'un écosystème économique marocain dynamique 
                et inclusif.
              </p>
              <p>
                Aujourd'hui, notre forum annuel est devenu un rendez-vous incontournable pour tous 
                ceux qui façonnent l'avenir économique du Maroc et de l'Afrique.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-green-800 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Moments Clés</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-200" size={20} />
                  <div>
                    <p className="font-semibold">2002</p>
                    <p className="text-green-200 text-sm">Création du Forum</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-green-200" size={20} />
                  <div>
                    <p className="font-semibold">2012</p>
                    <p className="text-green-200 text-sm">1er Forum International</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="text-green-200" size={20} />
                  <div>
                    <p className="font-semibold">2018</p>
                    <p className="text-green-200 text-sm">Prix Excellence Innovation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="text-green-200" size={20} />
                  <div>
                    <p className="font-semibold">2025</p>
                    <p className="text-green-200 text-sm">23ème édition</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
