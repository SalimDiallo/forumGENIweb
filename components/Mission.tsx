'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Target, Heart, Lightbulb, Star, Zap, Shield, Globe } from 'lucide-react';

const Mission = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Vert plus black: couleurs plus sombres, plus profondes, moins flashy
  const values = [
    {
      icon: <Target size={24} className="md:w-8 md:h-8" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans tout ce que nous entreprenons, en nous appuyant sur les meilleurs talents et pratiques.",
      bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      gradient: "from-green-900 to-green-700"
    },
    {
      icon: <Lightbulb size={24} className="md:w-8 md:h-8" />,
      title: "Innovation",
      description: "Nous encourageons la créativité et l'innovation pour construire l'économie de demain.",
      bgImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
      gradient: "from-green-800 to-green-600"
    },
    {
      icon: <Heart size={24} className="md:w-8 md:h-8" />,
      title: "Solidarité",
      description: "Nous croyons en la force du collectif et en l'importance de l'entraide pour réussir ensemble.",
      bgImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop",
      gradient: "from-green-900 to-emerald-800"
    },
    {
      icon: <Eye size={24} className="md:w-8 md:h-8" />,
      title: "Vision",
      description: "Nous gardons toujours en vue l'objectif d'un impact positif sur la société et l'économie.",
      bgImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      gradient: "from-emerald-900 to-emerald-700"
    }
  ];

  return (
    <section 
      className="py-16 sm:py-20 md:py-24 relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(10,20,10,0.97) 0%, rgba(20,30,20,0.95) 100%),
          url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-transparent to-black/60"></div>
      <div className="absolute top-1/4 right-1/4 w-24 h-24 md:w-48 md:h-48 bg-green-900/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/5 w-32 h-32 md:w-64 md:h-64 bg-black/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center px-4 sm:px-6 py-2 bg-green-900/20 border border-green-900/40 text-green-100 rounded-full mb-6 sm:mb-8 text-sm font-medium">
            <Star size={16} className="mr-2" />
            Mission • Vision • Valeurs
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-700">Identité</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Découvrez les valeurs et la vision qui nous animent depuis plus de 20 ans
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-16 sm:mb-20 md:mb-24">
          
          {/* Mission Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl transform transition-all duration-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{
              backgroundImage: `
                linear-gradient(135deg, rgba(10,30,10,0.97), rgba(20,40,20,0.98)),
                url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="p-6 sm:p-8 md:p-10 text-white relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Target className="text-green-200" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Notre Mission</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-gray-200">
                Connecter l'excellence académique de l'INSEA avec les leaders du monde professionnel 
                pour créer un écosystème d'innovation et d'entrepreneuriat qui façonne les leaders 
                de demain et contribue au développement économique durable du Maroc et de l'Afrique.
              </p>
              <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-black/20 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Vision Card */}
          <div
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl transform transition-all duration-700 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ 
              transitionDelay: '200ms',
              backgroundImage: `
                linear-gradient(135deg, rgba(20,40,20,0.97), rgba(10,30,10,0.98)),
                url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop')
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="p-6 sm:p-8 md:p-10 text-white relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Eye className="text-green-200" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Notre Vision</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-gray-200">
                Être la plateforme de référence qui unit l'expertise académique et l'innovation 
                entrepreneuriale, créant un impact positif et durable sur le développement 
                économique et social de notre région.
              </p>
              <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-black/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-700">Valeurs</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Les principes fondamentaux qui guident nos actions et notre engagement quotidien
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl transform transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ 
                transitionDelay: `${600 + index * 100}ms`,
                backgroundImage: `
                  linear-gradient(135deg, rgba(10,20,10,0.85), rgba(0,0,0,0.7)),
                  url('${value.bgImage}')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="p-4 sm:p-6 text-center relative z-10 h-full flex flex-col justify-between min-h-[280px] sm:min-h-[320px]">
                
                {/* Icon */}
                <div className={`mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-black/20 rounded-full blur-xl group-hover:bg-green-900/30 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div 
          className="text-center mt-16 sm:mt-20 md:mt-24 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(135deg, rgba(10,30,10,0.97), rgba(20,40,20,0.98)),
              url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-green-100 rounded-full mb-4 sm:mb-6 text-sm font-medium">
              <Zap size={16} className="mr-2" />
              Rejoignez Notre Mission
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ensemble, Construisons l'Avenir
            </h3>
            <p className="text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Participez à notre mission et aidez-nous à créer un impact positif durable
            </p>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-900 text-white font-semibold rounded-xl hover:bg-green-800 hover:scale-105 transition-all duration-300 text-sm sm:text-base">
              Découvrir Nos Actions
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-black/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 bg-black/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Mission;