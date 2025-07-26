'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Crown, Shield, Briefcase } from 'lucide-react';

const TeamsMembres = () => {
  // Données de l'organigramme
  const teamMembers = [
    {
      id: 1,
      name: "Achraf",
      role: "Président",
      image: "/team/president.jpg",
      level: 1,
      icon: Crown
    },
    {
      id: 2,
      name: "Sophia",
      role: "Vice-Présidente",
      image: "/team/president.jpg",
      level: 2,
      icon: Shield
    },
    {
      id: 3,
      name: "Karim Idrissi",
      role: "Secrétaire Général",
      image: "/team/president.jpg",
      level: 2,
      icon: Shield
    },
    {
      id: 4,
      name: "Yasmine Tazi",
      role: "Trésorière",
      image: "/team/president.jpg",
      level: 2,
      icon: Shield
    },
    {
      id: 5,
      name: "Omar Bensouda",
      role: "Responsable Communication",
      image: "/team/president.jpg",
      level: 3,
      icon: Briefcase
    },
    {
      id: 6,
      name: "Leila Chraibi",
      role: "Responsable Événements",
      image: "/team/president.jpg",
      level: 3,
      icon: Briefcase
    },
    {
      id: 7,
      name: "Mehdi Alaoui",
      role: "Responsable Partenariats",
      image: "/team/president.jpg",
      level: 3,
      icon: Briefcase
    },
    {
      id: 8,
      name: "Nadia Berrada",
      role: "Responsable Technique",
      image: "/team/president.jpg",
      level: 3,
      icon: Briefcase
    }
  ];

  return (
    <div className="w-full">
      {/* Section Organigramme */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30">
        <div className="container mx-auto px-2 sm:px-4 md:px-8">
          <div className="mb-12 md:mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow mb-4 sm:mb-6">
              <Users className="w-4 h-4" />
              <span className="font-semibold text-sm sm:text-base">Notre équipe</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-500 to-emerald-400 mb-3 sm:mb-6">
              Membres du Club
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-emerald-800/80 max-w-md sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
              Découvrez les personnes qui font vivre l'association et contribuent à sa réussite.
            </p>
          </div>

          {/* Organigramme */}
          <div className="max-w-6xl mx-auto">
            {/* Niveau 1 - Président */}
            <div className="flex flex-row flex-nowrap justify-center items-center gap-4 sm:gap-8 md:gap-12 overflow-x-auto mb-8 md:mb-16 pb-2">
              {teamMembers
                .filter(member => member.level === 1)
                .map(member => {
                  const IconComponent = member.icon;
                  return (
                    <div
                      key={member.id}
                      className="flex flex-col items-center group min-w-[140px] sm:min-w-[180px]"
                    >
                      <div className="relative w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6 rounded-full overflow-hidden border-4 border-emerald-600 shadow-2xl hover:shadow-emerald-400/40 transition-all duration-300 hover:scale-105">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
                        <div className="absolute top-2 right-2 xs:top-3 xs:right-3 w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <IconComponent className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-emerald-900 mb-1 sm:mb-2">{member.name}</h3>
                      <p className="text-emerald-700 font-semibold text-sm xs:text-base sm:text-lg">{member.role}</p>
                    </div>
                  );
                })}
            </div>

            {/* Connecteurs verticaux Niveau 1 à 2 */}
            <div className="flex justify-center mb-4 md:mb-8">
              <div className="w-0.5 h-8 xs:h-10 sm:h-16 bg-gradient-to-b from-emerald-600 to-blue-500 rounded-full"></div>
            </div>

            {/* Niveau 2 - Vice-président, Secrétaire, Trésorier */}
            <div className="flex flex-row flex-nowrap justify-center items-center gap-3 xs:gap-6 sm:gap-10 md:gap-16 overflow-x-auto mb-8 md:mb-16 pb-2">
              {teamMembers
                .filter(member => member.level === 2)
                .map(member => {
                  const IconComponent = member.icon;
                  return (
                    <div
                      key={member.id}
                      className="flex flex-col items-center group min-w-[110px] xs:min-w-[140px] sm:min-w-[180px]"
                    >
                      <div className="relative w-16 h-16 xs:w-24 xs:h-24 sm:w-32 sm:h-32 mb-2 xs:mb-4 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl hover:shadow-emerald-300/40 transition-all duration-300 hover:scale-105">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-800/20 to-transparent" />
                        <div className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 w-4 h-4 xs:w-6 xs:h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                          <IconComponent className="w-2 h-2 xs:w-3 xs:h-3 text-white" />
                        </div>
                      </div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-emerald-900 mb-0.5 xs:mb-1">{member.name}</h3>
                      <p className="text-emerald-700 font-medium text-xs xs:text-sm sm:text-base">{member.role}</p>
                      {/* Connecteur vertical vers niveau 3 */}
                      <div className="w-0.5 h-6 xs:h-8 sm:h-12 bg-gradient-to-b from-emerald-500 to-blue-500 mt-2 xs:mt-4 rounded-full"></div>
                    </div>
                  );
                })}
            </div>

            {/* Niveau 3 - Responsables départements */}
            <div className="flex flex-row flex-nowrap justify-center items-center gap-2 xs:gap-4 sm:gap-6 md:gap-12 overflow-x-auto pb-2">
              {teamMembers
                .filter(member => member.level === 3)
                .map(member => {
                  const IconComponent = member.icon;
                  return (
                    <div
                      key={member.id}
                      className="flex flex-col items-center group min-w-[90px] xs:min-w-[110px] sm:min-w-[140px]"
                    >
                      <div className="relative w-14 h-14 xs:w-20 xs:h-20 sm:w-28 sm:h-28 mb-1 xs:mb-3 rounded-full overflow-hidden border-2 sm:border-3 border-emerald-400 shadow-lg hover:shadow-emerald-200/40 transition-all duration-300 hover:scale-105">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-700/20 to-transparent" />
                        <div className="absolute top-1 right-1 xs:top-2 xs:right-2 w-3 h-3 xs:w-5 xs:h-5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                          <IconComponent className="w-1.5 h-1.5 xs:w-2.5 xs:h-2.5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xs xs:text-sm sm:text-lg font-bold text-emerald-900 mb-0.5 xs:mb-1 text-center">{member.name}</h3>
                      <p className="text-emerald-700 text-[10px] xs:text-xs sm:text-sm text-center max-w-24 xs:max-w-32">{member.role}</p>
                    </div>
                  );
                })}
            </div>
          </div>        
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;