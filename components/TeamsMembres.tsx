'use client';

import React, { useState } from 'react';
import { Users, Crown, Shield, Briefcase, Mail, Linkedin, MapPin, Calendar, Award, ChevronDown } from 'lucide-react';

interface TeamMember {
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
  joinDate?: string;
}

interface MemberCardProps {
  member: TeamMember;
  variant: 'hero' | 'executive' | 'department';
}

const TeamsMembres = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Achraf",
      role: "Président",
      description: "Leader visionnaire qui guide l'association vers l'excellence et l'innovation.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      level: 1,
      icon: Crown,
      email: "achraf@association.com",
      linkedin: "#",
      specialty: "Leadership & Stratégie",
      joinDate: "2020"
    },
    {
      id: 2,
      name: "Sophia",
      role: "Vice-Présidente",
      description: "Experte en coordination stratégique et développement organisationnel.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      level: 2,
      icon: Shield,
      email: "sophia@association.com",
      linkedin: "#",
      // specialty: "Management",
      joinDate: "2021"
    },
    {
      id: 3,
      name: "Karim Idrissi",
      role: "Secrétaire Général",
      description: "Pilote l'administration avec rigueur et efficacité.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      level: 2,
      icon: Briefcase,
      email: "karim@association.com",
      linkedin: "#",
      // specialty: "Administration",
      joinDate: "2021"
    },
    {
      id: 4,
      name: "Yasmine Tazi",
      role: "Trésorière",
      description: "Gère les finances avec transparence et expertise comptable.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      level: 2,
      icon: Shield,
      email: "yasmine@association.com",
      linkedin: "#",
      // specialty: "Finance",
      joinDate: "2021"
    },
    {
      id: 5,
      name: "Omar Bensouda",
      role: "Responsable Communication",
      description: "Architecte de notre présence digitale et stratégie de communication.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      level: 3,
      icon: Users,
      email: "omar@association.com",
      linkedin: "#",
      // specialty: "Digital Marketing",
      joinDate: "2022"
    },
    {
      id: 6,
      name: "Leila Chraibi",
      role: "Responsable Événements",
      description: "Créatrice d'expériences mémorables et coordinatrice exceptionnelle.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
      level: 3,
      icon: Calendar,
      email: "leila@association.com",
      linkedin: "#",
      // specialty: "Event Management",
      joinDate: "2022"
    },
    {
      id: 7,
      name: "Mehdi Alaoui",
      role: "Responsable Partenariats",
      description: "Développe notre réseau et forge des alliances stratégiques.",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face",
      level: 3,
      icon: Award,
      email: "mehdi@association.com",
      linkedin: "#",
      // specialty: "Business Development",
      joinDate: "2022"
    },
    {
      id: 8,
      name: "Nadia Berrada",
      role: "Responsable Technique",
      description: "Pionnière de l'innovation technologique au service de nos missions.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
      level: 3,
      icon: Shield,
      email: "nadia@association.com",
      linkedin: "#",
      // specialty: "Technology & Innovation",
      joinDate: "2022"
    }
  ];

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
          <div className="relative bg-gradient-to-br from-green-600 via-green-600 to-pink-600 p-1 rounded-3xl">
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
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-lg font-semibold text-green-600 mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4 leading-relaxed">{member.description}</p>
                
                {member.specialty && (
                  <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
                    <Award className="w-4 h-4 mr-1" />
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-10 h-10 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-4 h-4 text-gray-600 hover:text-green-600" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-10 h-10 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600 hover:text-green-600" />
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>
            
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
                  {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div> */}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-green-600 mb-2">{member.role}</p>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{member.description}</p>
                
                {member.specialty && (
                  <div className="text-xs text-green-600 font-medium mb-3">
                    {member.specialty}
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="w-7 h-7 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Mail className="w-3 h-3 text-gray-600" />
                  </a>
                  <a
                    href={member.linkedin}
                    className="w-7 h-7 bg-gray-100 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors duration-200"
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
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-16 bg-gradient-to-br overflow-hidden bg-gray-100">
        
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Users className="w-5 h-5 text-black" />
              <span className="text-sm font-medium text-black">Notre Équipe de Direction</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-black leading-tight">
              L'Excellence au Service de
              <span className="bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent"> Notre Vision</span>
            </h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto leading-relaxed">
              Découvrez les leaders passionnés qui transforment nos ambitions en réalité et guident notre association vers de nouveaux sommets.
            </p>
          </div>
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
          {/* <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bureau Exécutif</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les piliers de notre organisation qui orchestrent la stratégie et supervisent les opérations quotidiennes.
            </p>
          </div> */}
          
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
          {/* <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsables de Département</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Les experts spécialisés qui dirigent nos différents domaines d'activité avec expertise et passion.
            </p>
          </div> */}
          
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
              <div className="text-3xl font-bold text-green-600 mb-2">8</div>
              <div className="text-sm text-gray-600">Membres de Direction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
              <div className="text-sm text-gray-600">Années d'Expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r bg-gray-900">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Rejoignez Notre Aventure</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            Vous partagez notre passion et voulez contribuer à notre mission ? 
            Nous sommes toujours à la recherche de talents exceptionnels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
              Nous Rejoindre
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200">
              En Savoir Plus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamsMembres;