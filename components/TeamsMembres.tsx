'use client';

import React, { useState } from 'react';
import { Users, Crown, Shield, Briefcase, Mail, Linkedin, Calendar, Award } from 'lucide-react';
import Link from 'next/link';

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
  bureauYear: string;
}

interface MemberCardProps {
  member: BureauMember;
  variant: 'hero' | 'executive' | 'department';
}

// Membres réels du bureau 2025
const bureauMembers2025: BureauMember[] = [
  {
    id: 1,
    name: "TIRARY Achraf",
    role: "Président",
    description: "Dirige, représente, coordonne, vision, partenariats.",
    image: "/team/2025/AchrafTiraryP/achraf.JPG",
    level: 1,
    icon: Crown,
    email: "achraftiraryperso00@gmail.com",
    linkedin: "https://www.linkedin.com/in/achraf-tirary/",
    specialty: "Leadership",
    bureauYear: "2025"
  },
  {
    id: 2,
    name: "LBARRAH Yassine",
    role: "Vice-Président",
    description: "Coordonne, assiste, supervise, motive, représente.",
    image: "/team/2025/LbarrahyassineVP/yassine.JPG",
    level: 2,
    icon: Shield,
    email: "hello@lbarrahyassine.live",
    linkedin: "https://www.linkedin.com/in/yassinelbarrah/",
    bureauYear: "2025"
  },
  {
    id: 3,
    name: "TAKATRI Marwa",
    role: "Secrétaire Général",
    description: "Administration, coordination, archives, communication, réunions.",
    image: "/team/2025/Marwa Takatri , SG/marwa.JPG",
    level: 2,
    icon: Briefcase,
    email: "",
    linkedin: "https://www.linkedin.com/in/marwatakatri/",
    bureauYear: "2025"
  },
  {
    id: 4,
    name: "EL-BIYAALI Jabir",
    role: "Chef Cellule Revue",
    description: "Revue, éditorial, contenu, qualité, publication.",
    image: "/team/2025/JabirEl-Biyaali,R.Revue/jabir.JPG",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/jabir-el-biyaali-ab7aa0285/",
    bureauYear: "2025"
  },
  {
    id: 5,
    name: "AFELLA-IGHIR Kaoutar",
    role: "Chef Cellule Conférence",
    description: "Conférences, logistique, planning, intervenants, expérience.",
    image: "/team/2025/Kaoutar Afella-Ighir , R.Conf/IMG-20250623-WA0012.jpg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "https://www.linkedin.com/in/kawtar-afella-ighir-859577289/",
    bureauYear: "2025"
  },
  {
    id: 6,
    name: "EL MOUBACHOUR Oumaima",
    role: "Chef Cellule Communication",
    description: "Communication, promotion, réseaux, contenu, visuels.",
    image: "/team/2025/Oumaima El Moubachour , R.Com/IMG-20250623-WA0011.jpg",
    level: 3,
    icon: Users,
    email: "elmoubachouroumaima@gmail.com",
    linkedin: "https://www.linkedin.com/in/oumaima-elmoubachour-536941287/",
    bureauYear: "2025"
  },
  {
    id: 7,
    name: "GRANE Yousra",
    role: "Chef Cellule Communication",
    description: "Communication, stratégie, réseaux, médias, identité.",
    image: "/team/2025/Yousra Grane R.Com/yousra.jpg",
    level: 3,
    icon: Users,
    email: "graneyousra@gmail.com",
    linkedin: "https://www.linkedin.com/in/yousra-grane-63a3702a2/",
    bureauYear: "2025"
  },
  {
    id: 8,
    name: "BELAHCEN Rizki",
    role: "Chef Cellule Prospection",
    description: "Prospection, sponsors, partenariats, visibilité, négociation.",
    image: "/team/2025/Rizki Belahcen , R.Pros/IMG-20250625-WA0005.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/rizkibelahcen/",
    bureauYear: "2025"
  },
  {
    id: 9,
    name: "EL ALAMI Salma",
    role: "Chef Cellule Prospection",
    description: "Prospection, relations, partenariats, négociation, visibilité.",
    image: "/team/2025/Salma El Alami , R.Pros/salma.JPG",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/elalamisalma/",
    bureauYear: "2025"
  },
  {
    id: 10,
    name: "AOUIDIDDEN Younes",
    role: "Chef Cellule Prospection",
    description: "Prospection, sponsors, relations, visibilité, négociation.",
    image: "/team/2025/Younes Aouididden , R.Pros/youness.JPG",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2025"
  },
  {
    id: 11,
    name: "CAIDI Yassine",
    role: "Chef Cellule Logistique et Gala",
    description: "Logistique, gala, événements, coordination, opérationnel.",
    image: "/team/2025/Yassine Caidi , R.Logistique/caydi.JPG",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "https://www.linkedin.com/in/yassine-caidi-64081921b/",
    bureauYear: "2025"
  },
  {
    id: 12,
    name: "KILANI Walid",
    role: "Chef Cellule Technique",
    description: "Technique, infrastructure, web, évènements, numérique.",
    image: "/team/2025/kilani_walid.jpg",
    level: 3,
    icon: Shield,
    email: "walidkilani110@gmail.com",
    linkedin: "https://www.linkedin.com/in/kilani-walid-a2328b300/",
    bureauYear: "2025"
  },
  {
    id: 13,
    name: "AKKI Imran",
    role: "Chef Cellule Technique",
    description: "Infrastructure, technique, web, événements, innovation.",
    image: "/team/2025/akki_imran.jpg",
    level: 3,
    icon: Shield,
    email: "imranakki10@gmail.com",
    linkedin: "https://www.linkedin.com/in/imran-akki/",
    bureauYear: "2025"
  }
];

// Membres réels du bureau 2026
const bureauMembers2026: BureauMember[] = [
  // Président
  {
    id: 1001,
    name: "Yousra Alaoui Belghiti",
    role: "Présidente",
    description: "Dirige, représente, coordonne, vision, partenariats.",
    image: "/team/2026/alaoui_belghiti_yousra.jpg",
    level: 1,
    icon: Crown,
    email: "",
    linkedin: "",
    specialty: "Leadership",
    bureauYear: "2026"
  },
  // Vice-Président
  {
    id: 1002,
    name: "Walid Kilani",
    role: "Vice-Président",
    description: "Coordonne, assiste, supervise, motive, représente.",
    image: "/team/2026/kilani_walid.jpg",
    level: 2,
    icon: Shield,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Secrétaire générale
  {
    id: 1003,
    name: "Amal Lahkim",
    role: "Secrétaire Générale",
    description: "Administration, coordination, archives, communication, réunions.",
    image: "/team/2026/lahkim_amal.jpg",
    level: 2,
    icon: Briefcase,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Responsables Prospection
  {
    id: 1004,
    name: "Salma Chkoubi",
    role: "Responsable Prospection",
    description: "Prospection, sponsors, partenariats, visibilité, négociation.",
    image: "/team/2026/chkoubi_salma.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1005,
    name: "Amina Bajdouri",
    role: "Responsable Prospection",
    description: "Prospection, sponsors, relations, visibilité, négociation.",
    image: "/team/2026/bajdouri_amina.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1006,
    name: "Oukessou Soufiane",
    role: "Responsable Prospection",
    description: "Prospection, sponsors, partenariats, visibilité, négociation.",
    image: "/team/2026/oukessou_soufiane.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1007,
    name: "Saida Sessid",
    role: "Responsable Prospection",
    description: "Prospection, relations, partenariats, négociation, visibilité.",
    image: "/team/2026/sessid_saida.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Conférence
  {
    id: 1008,
    name: "Hala Ben Chama",
    role: "Chef Cellule Conférence",
    description: "Conférences, logistique, planning, intervenants, expérience.",
    image: "/team/2026/benchama_hala.jpg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1009,
    name: "Bahan Karafa Ashley Kevin",
    role: "Chef Cellule Conférence",
    description: "Conférences, planification, communication, organisation.",
    image: "/team/2026/bahan_karafa_ashley_kevin.jpg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Communication
  {
    id: 1010,
    name: "Ihssane El Malki",
    role: "Chef Cellule Communication",
    description: "Communication, promotion, réseaux, contenu, visuels.",
    image: "/team/2026/elmalki_ihssane.jpg",
    level: 3,
    icon: Users,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1011,
    name: "Nouha El Idrissi",
    role: "Chef Cellule Communication",
    description: "Communication, stratégie, réseaux, médias, identité.",
    image: "/team/2026/elidrissi_nouha.jpg",
    level: 3,
    icon: Users,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Revue
  {
    id: 1012,
    name: "DELL GBELI GHISLAIN BRICE KEVIN",
    role: "Chef Cellule Revue",
    description: "Revue, éditorial, contenu, qualité, publication.",
    image: "/team/2026/dell_gbeli_ghislain_brice_kevin.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1013,
    name: "Bah Elhadj Mamadou Lamarana",
    role: "Chef Cellule Revue",
    description: "Revue, éditorial, qualité, publication.",
    image: "/team/2026/bah_elhadj_mamadou_lamarana.jpg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chef Technique
  {
    id: 1014,
    name: "Imran Akki",
    role: "Chef Cellule Technique",
    description: "Technique, infrastructure, web, évènements, numérique.",
    image: "/team/2026/akki_imran.jpg",
    level: 3,
    icon: Shield,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Logistique & Gala
  {
    id: 1015,
    name: "Yassine Bentaleb",
    role: "Chef Cellule Logistique et Gala",
    description: "Logistique, gala, événements, coordination, opérationnel.",
    image: "/team/2026/bentaleb_yassine.jpg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  {
    id: 1016,
    name: "Oukhouya Ahmed",
    role: "Chef Cellule Logistique et Gala",
    description: "Logistique, gala, événements, coordination, opérationnel.",
    image: "/team/2026/oukhouya_ahmed.jpg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  }
];

const bureauByYear = {
  "2025": bureauMembers2025,
  "2026": bureauMembers2026
};

const sortedYears: (keyof typeof bureauByYear)[] = ["2026", "2025"];

const TeamsMembres = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<keyof typeof bureauByYear>("2026");

  const teamMembers = bureauByYear[selectedYear];

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
                <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">{member.description}</p>
                
                {member.specialty && (
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4">
                    <Award className="w-4 h-4 mr-1 text-gray-500" />
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                  </a>
                  )}
                  {member.linkedin && (
                  <a
                    href={member.linkedin}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                  </a>
                  )}
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
                <p className="text-xs text-gray-600 mb-3 line-clamp-2 whitespace-pre-line">{member.description}</p>
                
                {member.specialty && (
                  <div className="text-xs text-gray-700 font-medium mb-3">
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Mail className="w-3 h-3 text-gray-600" />
                  </a>
                  )}
                  {member.linkedin && (
                  <a
                    href={member.linkedin}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="w-3 h-3 text-gray-600" />
                  </a>
                  )}
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
              <p className="text-xs text-gray-500 mb-3 line-clamp-2 whitespace-pre-line">{member.description}</p>

              <div className="flex justify-center gap-1">
                {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                >
                  <Mail className="w-3 h-3 text-gray-600" />
                </a>
                )}
                {member.linkedin && (
                <a
                  href={member.linkedin}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors duration-200"
                >
                  <Linkedin className="w-3 h-3 text-gray-600" />
                </a>
                )}
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
              onClick={() => setSelectedYear(year)}
              className={`px-5 py-2 rounded-full font-semibold transition-colors duration-200 ${
                selectedYear === year
                  ? "bg-gray-800 text-white shadow"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* Président */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-md mx-auto">
            {teamMembers
              .filter(member => member.level === 1 && member.role.toLowerCase().includes("président"))
              .map(member => (
                <MemberCard key={member.id} member={member} variant="hero" />
              ))}
          </div>
        </div>
      </section>

      {/* Vice-Président et Secrétaire Général */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {teamMembers
              .filter(member =>
                member.level === 2 && (
                  member.role.toLowerCase().includes("vice-président")
                  || member.role.toLowerCase().includes("vice president")
                  || member.role.toLowerCase().includes("secrétaire général")
                  || member.role.toLowerCase().includes("secretaire general")
                )
              )
              .map(member => (
                <MemberCard key={member.id} member={member} variant="executive" />
              ))}
          </div>
        </div>
      </section>

      {/* Chefs de Cellules */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
            <Link href={"/contact"} className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              Nous contactez
            </Link>
            <Link href={"/about"} className="border-2 border-gray-700 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              En Savoir Plus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;