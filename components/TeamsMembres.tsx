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

// Membres réels du bureau 2026 - FILIÈRES/LINKEDIN/EMAIL à jour via instruction
const bureauMembers2026: BureauMember[] = [
  // Président
  {
    id: 1001,
    name: "Yousra Alaoui Belghiti",
    role: "Présidente",
    description: "Actuariat & Finance",
    image: "/team/2026/yousra.jpeg",
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
    image: "/team/2026/walid.jpeg",
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
    image: "/team/2026/amal.jpeg",
    level: 2,
    icon: Briefcase,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Conférence
  {
    id: 1008,
    name: "Hala Ben Chama",
    role: "Chef Cellule Conférence",
    description: "Biostatistique Démographie et Big Data",
    image: "/team/2026/hala.jpeg",
    level: 3,
    icon: Calendar,
    email: "benchamahala@gmail.com",
    linkedin: "https://www.linkedin.com/in/hala-ben-chama-070960320/",
    bureauYear: "2026"
  },
  {
    id: 1009,
    name: "Bahan Karafa Ashley Kevin",
    role: "Chef Cellule Conférence",
    description: "Conférences, planification, communication, organisation.",
    image: "/team/2026/kevin.jpeg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chefs Communication
  {
    id: 1010,
    name: "Ihssan Malki Lhlaybi",
    role: "Chef Cellule Communication",
    description: "Actuariat Finance",
    image: "/team/2026/ihssane.jpeg",
    level: 3,
    icon: Users,
    email: "ihssanemalki61@gmail.com",
    linkedin: "https://www.linkedin.com/in/ihssan-malki-lhlaybi-b63606264?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    bureauYear: "2026"
  },
  {
    id: 1011,
    name: "Diallo Sidy Mohamed Salim",
    role: "Chef Cellule Communication",
    description: "Data and Software Engineering",
    image: "/team/2026/salim.jpeg",
    level: 3,
    icon: Users,
    email: "sidymamadousalim@gmail.com",
    linkedin: "https://www.linkedin.com/in/sidy-mohamed-salim-diallo-855696264/",
    bureauYear: "2026"
  },
  // Responsables Prospection
  {
    id: 1004,
    name: "Salma Chkoubi",
    role: "Responsable Prospection",
    description: "Data & Software Engineering",
    image: "/team/2026/salma.jpeg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/salma-chkoubi-568193342?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    bureauYear: "2026"
  },
  {
    id: 1005,
    name: "Amina Bajdouri",
    role: "Responsable Prospection",
    description: "Data & Software Engineering",
    image: "/team/2026/amina.jpeg",
    level: 3,
    icon: Award,
    email: "amina.bajdouri04@gmail.com",
    linkedin: "https://www.linkedin.com/in/amina-bajdouri-a1395b258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    bureauYear: "2026"
  },
  {
    id: 1006,
    name: "Soufiane Oukessou",
    role: "Responsable Prospection",
    description: "Data Science",
    image: "/team/2026/soufiane.jpeg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/soufiane-oukessou-b69153253/",
    bureauYear: "2026"
  },
  {
    id: 1007,
    name: "Saida Sessid",
    role: "Responsable Prospection",
    description: "Actuariat Finance",
    image: "/team/2026/saida.jpeg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/saida-sessid-a6397b326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    bureauYear: "2026"
  },
  // Chefs Revue
  {
    id: 1012,
    name: "DELL GBELI GHISLAIN BRICE KEVIN",
    role: "Chef Cellule Revue",
    description: "Sciences de la Décision et  Recherche Opérationnelle",
    image: "/team/2026/dell.jpeg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "https://www.linkedin.com/in/kevin-dell-146ab8254?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    bureauYear: "2026"
  },
  {
    id: 1016,
    name: "Nouha El Idrissi",
    role: "Chef Cellule Revue",
    description: "Revue, éditorial, contenu, qualité, publication.",
    image: "/team/2026/nouha.jpeg",
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
    image: "/team/2026/bah.jpeg",
    level: 3,
    icon: Award,
    email: "",
    linkedin: "",
    bureauYear: "2026"
  },
  // Chef Technique
  {
    id: 1014,
    name: "Imran AKKI",
    role: "Chef Cellule Technique",
    description: "Data & Software Engineering",
    image: "/team/2026/imran.jpeg",
    level: 3,
    icon: Shield,
    email: "",
    linkedin: "https://www.linkedin.com/in/imran-akki?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    bureauYear: "2026"
  },
  // Chefs Logistique & Gala
  {
    id: 1015,
    name: "Yassine Bentaleb & Oukhouya Ahmad",
    role: "Chef Cellule Logistique et Gala",
    description: "Yassine Bentaleb : Economie Appliquée Statistique et Big Data\nOukhouya Ahmad : Economie Appliquée Statistique et Big Data",
    image: "/team/2026/logistique.jpeg",
    level: 3,
    icon: Calendar,
    email: "",
    linkedin: "https://www.linkedin.com/in/yassine-bentaleb-823a51269/",
    bureauYear: "2026"
  },
];

const bureauByYear = {
  "2025": bureauMembers2025,
  "2026": bureauMembers2026
};

const sortedYears: (keyof typeof bureauByYear)[] = ["2026", "2025"];

// Images de groupe pour chaque bureau
const teamGroupImages = {
  "2025": "/team/2025/team-group.jpg",
  "2026": "/team/2026/team.jpeg"
};

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
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-1 rounded-3xl shadow-sm">
            <div className="bg-white rounded-3xl overflow-hidden h-full">
              {/* Image principale - beaucoup plus grande */}
              <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

                {/* Badge icon sur l'image */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>

                {/* Nom et rôle en bas de l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-3xl font-bold mb-1 drop-shadow-lg">{member.name}</h3>
                  <p className="text-xl font-semibold text-white/90 drop-shadow-md">{member.role}</p>
                </div>
              </div>

              {/* Contenu en dessous */}
              <div className="p-8">
                <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line text-center">{member.description}</p>

                {member.specialty && (
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      {member.specialty}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-11 h-11 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  )}
                  {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
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
          <div className={`relative bg-white rounded-2xl transition-all duration-300 overflow-hidden ${
            isHovered ? 'transform -translate-y-2' : ''
          }`}>
            {/* Image large en haut */}
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"></div>

              {/* Badge role */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{member.name}</h3>
                <p className="text-lg font-semibold text-white/90 drop-shadow-md">{member.role}</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-3 text-center whitespace-pre-line">{member.description}</p>

              {member.specialty && (
                <div className="text-xs text-gray-700 font-medium mb-3 text-center">
                  {member.specialty}
                </div>
              )}

              <div className="flex justify-center gap-2">
                {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-4 h-4" />
                </a>
                )}
                {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                )}
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
        <div className={`bg-white rounded-xl transition-all duration-300 overflow-hidden ${
          isHovered ? 'transform -translate-y-1' : ''
        }`}>
          {/* Image rectangulaire en haut */}
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

            {/* Icon badge */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <IconComponent className="w-4 h-4 text-gray-700" />
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-base font-bold text-gray-900 mb-1 text-center">{member.name}</h3>
            <p className="text-xs font-semibold text-gray-600 mb-2 text-center">{member.role}</p>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2 whitespace-pre-line text-center">{member.description}</p>

            <div className="flex justify-center gap-2">
              {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="w-7 h-7 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-3 h-3" />
              </a>
              )}
              {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-gray-100 hover:bg-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-3 h-3" />
              </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const YearNavigation = () => (
    <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Sélectionnez le Bureau
          </h2>
          <p className="text-gray-600">Découvrez les équipes qui ont marqué le Forum GENI</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {sortedYears.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedYear === year
                  ? "bg-gray-800 text-white shadow-lg"
                  : "bg-white text-gray-800 hover:bg-gray-100 border-2 border-gray-300"
              }`}
            >
              Bureau {year}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="w-full">
      {/* Navigation par année - En haut */}
      <YearNavigation />

      {/* Hero Section */}
      <section className="relative py-16 bg-gray-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10  blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5  blur-2xl"></div>

        <div className="relative container mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm  mb-6">
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

      {/* Photo de groupe de l'équipe */}
      <section className="relative w-full overflow-hidden">
        <img
          src={teamGroupImages[selectedYear]}
          alt={`Équipe ${selectedYear}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Texte superposé */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="container mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Bureau {selectedYear}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-md">
              Une équipe passionnée et dévouée au service de l'excellence
            </p>
          </div>
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

      {/* Chefs de Cellules - Groupés par cellule */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Grouper les membres par cellule */}
          {(() => {
            // Créer un objet pour grouper par cellule
            const celluleGroups: { [key: string]: BureauMember[] } = {};

            teamMembers
              .filter(member => member.level === 3)
              .forEach(member => {
                const celluleName = member.role.includes('Prospection') ? 'Prospection'
                  : member.role.includes('Communication') ? 'Communication'
                  : member.role.includes('Conférence') ? 'Conférence'
                  : member.role.includes('Revue') ? 'Revue'
                  : member.role.includes('Technique') ? 'Technique'
                  : member.role.includes('Logistique') ? 'Logistique et Gala'
                  : 'Autre';

                if (!celluleGroups[celluleName]) {
                  celluleGroups[celluleName] = [];
                }
                celluleGroups[celluleName].push(member);
              });

            return Object.entries(celluleGroups).map(([celluleName, members]) => (
              <div key={celluleName} className="mb-12">
                {/* Titre de la cellule */}
                <div className="mb-6 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Cellule {celluleName}
                  </h3>
                  <div className="w-24 h-1 bg-gray-800 mx-auto"></div>
                </div>

                {/* Cartes des membres de cette cellule */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex flex-wrap justify-center gap-6">
                    {members.map(member => (
                      <div key={member.id} className="w-full sm:w-auto sm:min-w-[250px] sm:max-w-[300px]">
                        <MemberCard member={member} variant="department" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </section>
        {/* Navigation par année - En bas */}
        <YearNavigation />

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
            <Link href={"/contact"} className="bg-white text-gray-800 px-8 py-3  font-semibold hover:bg-gray-100 transition-colors duration-200">
              Nous contactez
            </Link>
            <Link href={"/about"} className="border-2 border-gray-700 text-gray-700 px-8 py-3  font-semibold hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              En Savoir Plus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;