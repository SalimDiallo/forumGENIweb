'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Calendar, Award } from 'lucide-react';

const Stats = () => {
  const [counters, setCounters] = useState({
    participants: 0,
    partners: 0,
    events: 0,
    years: 0
  });

  const finalNumbers = {
    participants: 5000,
    partners: 85,
    events: 127,
    years: 23
  };

  useEffect(() => {
    const animateCounters = () => {
      const duration = 1000; // Réduit à 1 seconde
      const steps = 30; // Réduit le nombre d'étapes
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          participants: Math.floor(finalNumbers.participants * progress),
          partners: Math.floor(finalNumbers.partners * progress),
          events: Math.floor(finalNumbers.events * progress),
          years: Math.floor(finalNumbers.years * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters(finalNumbers);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounters, 200); // Réduit le délai
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: <Users className="text-green-600" size={40} />,
      number: counters.participants,
      label: "Participants",
      suffix: "+"
    },
    {
      icon: <Building className="text-green-600" size={40} />,
      number: counters.partners,
      label: "Partenaires",
      suffix: ""
    },
    {
      icon: <Calendar className="text-green-600" size={40} />,
      number: counters.events,
      label: "Événements",
      suffix: ""
    },
    {
      icon: <Award className="text-green-600" size={40} />,
      number: counters.years,
      label: "Années d'Excellence",
      suffix: ""
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-800 to-green-700">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Notre Impact en Chiffres
          </h2>
          <p className="text-xl text-green-200 max-w-2xl mx-auto">
            17 années d'engagement pour connecter l'académique et le professionnel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20"
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-green-200 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">95%</h3>
              <p className="text-green-200">Taux de satisfaction des participants</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">78%</h3>
              <p className="text-green-200">Des participants trouvent un emploi dans les 6 mois</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">42</h3>
              <p className="text-green-200">Start-ups créées par nos alumni</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
