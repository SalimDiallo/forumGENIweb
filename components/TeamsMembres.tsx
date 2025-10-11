'use client';

import React, { useState } from 'react';
import { Users, Crown, Shield, Briefcase, Mail, Linkedin, MapPin, Calendar, Award, ChevronDown } from 'lucide-react';

// Nouvelle structure : la clé est l'année où la personne est devenue membre du bureau
interface BureauMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  email: string;
  linkedin: string;
  specialty?: string;
  bureauYear: string; // Année d'entrée au bureau
}

interface MemberCardProps {
  member: BureauMember;
  variant: 'hero' | 'executive' | 'department';
}

type BureauByYear = {
  [year: string]: BureauMember[];
};

// Les membres du bureau, regroupés par année d'entrée au bureau
const bureauMembers: BureauMember[] = [
  // 2025
  {
    id: 1,
    name: "Achraf Tirary",
    role: "Président",
    description: "Président du bureau 2025.",
    image: "/team/2025/AchrafTiraryP/achraf.JPG",
    level: 1,
    icon: Crown,
    email: "achraf@forum.com",
    linkedin: "https://linkedin.com/in/achraf2025",
    specialty: "Management",
    bureauYear: "2025"
  },
  {
    id: 2,
    name: "Lbarrah Yassine",
    role: "Vice-Président",
    description: "Vice-Présidente du bureau 2025.",
    image: "/team/2025/LbarrahyassineVP/yassine.JPG",
    level: 2,
    icon: Shield,
    email: "sophia@forum.com",
    linkedin: "https://linkedin.com/in/sophia2025",
    bureauYear: "2025"
  },
  {
    id: 3,
    name: "Karim Idrissi",
    role: "Secrétaire Général",
    description: "Secrétaire Général du bureau 2025.",
    image: "/team/2025/karim_idrissi.jpg",
    level: 2,
    icon: Briefcase,
    email: "karim.idrissi@forum.com",
    linkedin: "https://linkedin.com/in/karimidrissi2025",
    bureauYear: "2025"
  },
  {
    id: 4,
    name: "Yasmine Tazi",
    role: "Trésorière",
    description: "Trésorière du bureau 2025.",
    image: "/team/2025/yasmine_tazi.jpg",
    level: 2,
    icon: Shield,
    email: "yasmine.tazi@forum.com",
    linkedin: "https://linkedin.com/in/yasminetazi2025",
    bureauYear: "2025"
  },
  {
    id: 5,
    name: "Omar Bensouda",
    role: "Responsable Communication",
    description: "Responsable Communication du bureau 2025.",
    image: "/team/2025/omar_bensouda.jpg",
    level: 3,
    icon: Users,
    email: "omar.bensouda@forum.com",
    linkedin: "https://linkedin.com/in/omarbensouda2025",
    bureauYear: "2025"
  },
  {
    id: 6,
    name: "Leila Chraibi",
    role: "Responsable Événements",
    description: "Responsable Événements du bureau 2025.",
    image: "/team/2025/leila_chraibi.jpg",
    level: 3,
    icon: Calendar,
    email: "leila.chraibi@forum.com",
    linkedin: "https://linkedin.com/in/leilachraibi2025",
    bureauYear: "2025"
  },
  {
    id: 7,
    name: "Mehdi Alaoui",
    role: "Responsable Partenariats",
    description: "Responsable Partenariats du bureau 2025.",
    image: "/team/2025/mehdi_alaoui.jpg",
    level: 3,
    icon: Award,
    email: "mehdi.alaoui@forum.com",
    linkedin: "https://linkedin.com/in/mehdialaoui2025",
    bureauYear: "2025"
  },
  {
    id: 8,
    name: "Nadia Berrada",
    role: "Responsable Technique",
    description: "Responsable Technique du bureau 2025.",
    image: "/team/2025/nadia_berrada.jpg",
    level: 3,
    icon: Shield,
    email: "nadia.berrada@forum.com",
    linkedin: "https://linkedin.com/in/nadiaberrada2025",
    bureauYear: "2025"
  },

  // 2021 par exemple
  {
    id: 108,
    name: "Nadia Berrada",
    role: "Responsable Technique",
    description: "Responsable Technique du bureau 2021.",
    image: "/team/2021/nadia_berrada.jpg",
    level: 3,
    icon: Shield,
    email: "nadia.berrada@forum.com",
    linkedin: "https://linkedin.com/in/nadiaberrada2021",
    bureauYear: "2021"
  },
  // Ajoutez d'autres années/membres ici si besoin
];

// Regrouper les membres du bureau par année d'entrée au bureau
const bureauByYear: BureauByYear = bureauMembers.reduce((acc, member) => {
  const year = member.bureauYear || 'Autre';
  if (!acc[year]) acc[year] = [];
  acc[year].push(member);
  return acc;
}, {} as BureauByYear);

const sortedYears = Object.keys(bureauByYear).sort((a, b) => b.localeCompare(a)); // Descendant

const TeamsMembres = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(sortedYears[0]);

  const teamMembers = bureauByYear[selectedYear] || [];

  const MemberCard: React.FC<MemberCardProps> = ({ member, variant }) => {
    const IconComponent = member.icon;
    const isHovered = hoveredCard === member.id;

    if (variant === 'hero') {
      return (
        <div 
          className="relative group"
          onMouseEnter={() => setHoveredCard(member.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative bg-gray-200 p-1 rounded-3xl">
            <div className="bg-white rounded-3xl p-8 h-full">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-lg font-semibold text-gray-700 mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4 leading-relaxed">{member.description}</p>
                
                {member.specialty && (
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4">
                    <Award className="w-4 h-4 mr-1 text-gray-500" />
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'executive') {
      return (
        <div 
          className="group cursor-pointer"
          onMouseEnter={() => setHoveredCard(member.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
            isHovered ? 'transform -translate-y-2' : ''
          }`}>
            <div className="absolute inset-0 bg-gray-100 opacity-60"></div>
            
            <div className="relative p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-white shadow-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-gray-700 mb-2">{member.role}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{member.description}</p>
                
                {member.specialty && (
                  <div className="text-xs text-gray-700 font-medium mb-3">
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Mail className="w-3 h-3 text-gray-600" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="w-3 h-3 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Department variant
    return (
      <div 
        className="group cursor-pointer"
        onMouseEnter={() => setHoveredCard(member.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isHovered ? 'transform -translate-y-1' : ''
        }`}>
          <div className="p-5">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-400 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-xs font-semibold text-gray-600 mb-2">{member.role}</p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{member.description}</p>

              <div className="flex justify-center gap-1">
                <a
                  href={`mailto:${member.email}`}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                >
                  <Mail className="w-3 h-3 text-gray-600" />
                </a>
                <a
                  href={member.linkedin}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                >
                  <Linkedin className="w-3 h-3 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-16 bg-gray-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Users className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Notre Équipe de Direction</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              L'Excellence au Service de
              <span className="text-gray-700"> Notre Vision</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Découvrez les leaders passionnés qui transforment nos ambitions en réalité et guident notre association vers de nouveaux sommets.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation par année */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 flex flex-wrap justify-center gap-3">
          {sortedYears.map((year) => (
            <button
              key={year}
              className={`px-5 py-2 rounded-full font-semibold transition-colors duration-200 ${
                selectedYear === year
                  ? 'bg-gray-800 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* President Section */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-md mx-auto">
            {teamMembers
              .filter(member => member.level === 1)
              .map(member => (
                <MemberCard key={member.id} member={member} variant="hero" />
              ))}
          </div>
        </div>
      </section>

      {/* Executive Board */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers
              .filter(member => member.level === 2)
              .map(member => (
                <MemberCard key={member.id} member={member} variant="executive" />
              ))}
          </div>
        </div>
      </section>

      {/* Department Heads */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {teamMembers
              .filter(member => member.level === 3)
              .map(member => (
                <MemberCard key={member.id} member={member} variant="department" />
              ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">{teamMembers.length}</div>
              <div className="text-sm text-gray-600">Membres de Direction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">{sortedYears.length}</div>
              <div className="text-sm text-gray-600">Années d'Équipes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">100%</div>
              <div className="text-sm text-gray-600">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Rejoignez Notre Aventure</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Vous partagez notre passion et voulez contribuer à notre mission ? 
            Nous sommes toujours à la recherche de talents exceptionnels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              Nous Rejoindre
            </button>
            <button className="border-2 border-gray-700 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              En Savoir Plus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;