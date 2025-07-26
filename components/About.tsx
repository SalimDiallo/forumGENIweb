'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Award, Target, Sparkles, Globe, TrendingUp, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineEvents = [
    {
      year: 2002,
      title: "L'Étincelle Initiale",
      description: "Naissance du Forum GENI INSEA par des étudiants visionnaires qui ont osé rêver grand",
      icon: <Sparkles size={20} className="md:w-6 md:h-6" />,
      participants: "50 participants",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop"
    },
    {
      year: 2007,
      title: "Expansion Régionale",
      description: "Ouverture aux entreprises régionales et premières partnerships stratégiques",
      icon: <TrendingUp size={20} className="md:w-6 md:h-6" />,
      participants: "200+ participants",
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop"
    },
    {
      year: 2012,
      title: "Rayonnement International",
      description: "Premier Forum International avec des speakers de renommée mondiale",
      icon: <Globe size={20} className="md:w-6 md:h-6" />,
      participants: "500+ participants",
      bgImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
    },
    {
      year: 2018,
      title: "Innovation & Excellence",
      description: "Prix d'Excellence en Innovation décerné par le Ministère de l'Enseignement",
      icon: <Award size={20} className="md:w-6 md:h-6" />,
      participants: "800+ participants",
      bgImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
    },
    {
      year: 2023,
      title: "Transformation Digitale",
      description: "Adoption du format hybride et lancement de la plateforme digitale révolutionnaire",
      icon: <BookOpen size={20} className="md:w-6 md:h-6" />,
      participants: "1200+ participants",
      bgImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop"
    },
    {
      year: 2025,
      title: "Vision Futuriste",
      description: "23ème édition avec focus sur l'IA et les technologies émergentes du futur",
      icon: <Lightbulb size={20} className="md:w-6 md:h-6" />,
      participants: "1500+ participants",
      bgImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
    }
  ];

  // const stats = [
  //   { number: "23", label: "Années d'Excellence", icon: <Calendar size={16} className="md:w-5 md:h-5" /> },
  //   { number: "500+", label: "Experts Mobilisés", icon: <Users size={16} className="md:w-5 md:h-5" /> },
  //   { number: "15K+", label: "Participants Cumulés", icon: <Target size={16} className="md:w-5 md:h-5" /> },
  //   { number: "50+", label: "Entreprises Partenaires", icon: <Award size={16} className="md:w-5 md:h-5" /> }
  // ];

  return (
    <section 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%),
          url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-white-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 md:w-48 md:h-48 bg-white-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        
        {/* Hero Section */}
        <div className={`text-center mb-16 sm:mb-24 md:mb-32 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full mb-6 sm:mb-8 text-xs sm:text-sm font-medium backdrop-blur-sm">
            2002 → 2025 • 23 ans d'excellence
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white-400">Histoire</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xs sm:max-w-lg md:max-w-3xl mx-auto leading-relaxed px-4">
            Découvrez l'évolution du Forum GENI INSEA à travers plus de deux décennies d'innovation et d'excellence
          </p>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-16 sm:mb-24 md:mb-32">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 md:p-6 text-center transform transition-all duration-700 hover:scale-105 hover:bg-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-2 sm:mb-3 text-green-400">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-gray-400 text-xs sm:text-sm leading-tight">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Timeline */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-12 md:mb-16 px-4">
            Étapes <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white-400">Clés</span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className={`relative flex flex-col sm:flex-row items-start mb-8 sm:mb-12 transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : index % 2 === 0 ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline Line - Hidden on mobile */}
                <div className="hidden sm:block absolute left-6 md:left-8 top-12 md:top-16 w-0.5 h-full bg-gradient-to-b from-green-500/50 to-transparent"></div>
                
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-white-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 sm:border-4 border-slate-800 z-10 mb-4 sm:mb-0 mx-auto sm:mx-0">
                  {event.icon}
                </div>
                
                {/* Content */}
                <div 
                  className="sm:ml-6 md:ml-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 flex-1 relative overflow-hidden w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('${event.bgImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Content overlay */}
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">{event.title}</h3>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 text-center sm:text-right">{event.year}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{event.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <span className="px-3 sm:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs sm:text-sm font-medium text-center backdrop-blur-sm">
                        {event.participants}
                      </span>
                      <ArrowRight className="text-gray-400 hidden sm:block" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div 
          className="text-center mt-16 sm:mt-24 md:mt-32 rounded-2xl p-6 sm:p-8 md:p-12 border border-white/10 relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1)),
              url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 backdrop-blur-sm bg-black/20 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Rejoignez l'Aventure
            </h3>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Participez à la prochaine édition et faites partie de cette histoire exceptionnelle
            </p>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-white-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base">
              En Savoir Plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;