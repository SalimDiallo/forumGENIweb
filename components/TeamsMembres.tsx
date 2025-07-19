// components/KeyFiguresAndTeam.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TeamsMembres = () => {
  // Données de l'organigramme
  const teamMembers = [
    {
      id: 1,
      name: "Achraf",
      role: "Président",
      image: "/team/president.jpg",
      level: 1
    },
    {
      id: 2,
      name: "Sophia",
      role: "Vice-Présidente",
      image: "/team/vice-president.jpg",
      level: 2
    },
    
    {
      id: 3,
      name: "Karim Idrissi",
      role: "Secrétaire Général",
      image: "/team/secretary.jpg",
      level: 2
    },
    {
      id: 4,
      name: "Yasmine Tazi",
      role: "Trésorière",
      image: "/team/treasurer.jpg",
      level: 2
    },
    {
      id: 5,
      name: "Omar Bensouda",
      role: "Responsable Communication",
      image: "/team/communication.jpg",
      level: 3
    },
    {
      id: 6,
      name: "Leila Chraibi",
      role: "Responsable Événements",
      image: "/team/events.jpg",
      level: 3
    },
    {
      id: 7,
      name: "Mehdi Alaoui",
      role: "Responsable Partenariats",
      image: "/team/partnerships.jpg",
      level: 3
    },
    {
      id: 8,
      name: "Nadia Berrada",
      role: "Responsable Technique",
      image: "/team/technical.jpg",
      level: 3
    }
  ];


  return (
    <div className="w-full">


      {/* Section Organigramme */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center p-1 bg-green-100 rounded-full mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
                Notre équipe
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
              Membres du Club
            </h2>
            <p className="text-lg text-green-700/80 max-w-2xl mx-auto">
              Découvrez les personnes qui font vivre l'association et contribuent à sa réussite.
            </p>
          </motion.div>

          {/* Organigramme */}
          <div className="max-w-5xl mx-auto">
            {/* Niveau 1 - Président */}
            <div className="flex justify-center mb-12">
              {teamMembers
                .filter(member => member.level === 1)
                .map(member => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-green-800">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">{member.name}</h3>
                    <p className="text-green-700 font-medium">{member.role}</p>
                  </motion.div>
                ))}
            </div>

            {/* Connecteurs verticaux Niveau 1 à 2 */}
            <div className="flex justify-center">
              <div className="w-1 h-12 bg-green-800"></div>
            </div>

            {/* Niveau 2 - Vice-président, Secrétaire, Trésorier */}
            <div className="flex justify-center mb-12">
              <div className="flex flex-col items-center">
                {/* Connecteur horizontal */}
                <div className="w-full h-1 bg-green-800 mb-6"></div>
                
                {/* Membres niveau 2 */}
                <div className="flex flex-wrap justify-center gap-12">
                  {teamMembers
                    .filter(member => member.level === 2)
                    .map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border-4 border-green-700">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-green-900">{member.name}</h3>
                        <p className="text-green-700 font-medium">{member.role}</p>
                        {/* Connecteur vertical vers niveau 3 */}
                        <div className="w-1 h-12 bg-green-700 mt-4"></div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* Niveau 3 - Responsables départements */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                {/* Connecteur horizontal */}
                <div className="w-full h-1 bg-green-700 mb-6"></div>
                
                {/* Membres niveau 3 */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  {teamMembers
                    .filter(member => member.level === 3)
                    .map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative w-20 h-20 mb-2 rounded-full overflow-hidden border-3 border-green-600">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-base font-bold text-green-900">{member.name}</h3>
                        <p className="text-green-700 text-sm">{member.role}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </div>        
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;