'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Calendar, Award, TrendingUp, Sparkles } from 'lucide-react';

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
      const duration = 1500;
      const steps = 50;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 2);
        
        setCounters({
          participants: Math.floor(finalNumbers.participants * easeOut),
          partners: Math.floor(finalNumbers.partners * easeOut),
          events: Math.floor(finalNumbers.events * easeOut),
          years: Math.floor(finalNumbers.years * easeOut)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters(finalNumbers);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateCounters, 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: <Users size={28} />,
      number: counters.participants,
      label: "Participants",
      suffix: "+",
      description: "Talents accompagnés"
    },
    {
      icon: <Building size={28} />,
      number: counters.partners,
      label: "Partenaires",
      suffix: "",
      description: "Entreprises partenaires"
    },
    {
      icon: <Calendar size={28} />,
      number: counters.events,
      label: "Événements",
      suffix: "",
      description: "Rencontres organisées"
    },
    {
      icon: <Award size={28} />,
      number: counters.years,
      label: "Années d'Excellence",
      suffix: "",
      description: "D'expérience reconnue"
    }
  ];

  const additionalStats = [
    { value: "95%", label: "Taux de satisfaction", icon: <Sparkles size={20} /> },
    { value: "78%", label: "Trouvent un emploi en 6 mois", icon: <TrendingUp size={20} /> },
    { value: "42", label: "Start-ups créées par nos alumni", icon: <Award size={20} /> }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-lg mb-6">
            <Sparkles size={18} />
            <span className="font-medium">Notre Impact</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Des Résultats qui Parlent
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            23 années d'engagement pour connecter l'académique et le professionnel
          </p>
        </motion.div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center hover:shadow-md transition-all duration-300"
            >
              {/* Icône */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
                  {stat.icon}
                </div>
              </div>

              {/* Nombre */}
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stat.number.toLocaleString()}{stat.suffix}
              </div>

              {/* Label */}
              <div className="text-slate-900 font-semibold mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-slate-500 text-sm">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistiques additionnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
            Excellence & Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalStats.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="text-emerald-800">
                    {item.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {item.value}
                </div>
                <div className="text-slate-600">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-600">
            Rejoignez une communauté qui transforme les ambitions en réussites
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;