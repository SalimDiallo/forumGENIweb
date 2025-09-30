'use client';

import React, { useState } from 'react';
import { Play, Quote, Users, Award, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

const VideoTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Bennani",
      role: "Diplômée Génie Informatique",
      company: "TechVision",
      video: "/testimonials/sarah-bennani.mp4",
      thumbnail: "/testimonials/sarah-thumb.jpg",
      quote: "L'association GENI m'a permis de développer mes compétences en leadership et de créer un réseau professionnel solide dès mes études.",
      year: "Promo 2022",
      achievement: "Startup fondée"
    },
    {
      id: 2,
      name: "Mehdi Alaoui",
      role: "Ingénieur Génie Civil",
      company: "Groupe OCP",
      video: "/testimonials/mehdi-alaoui.mp4",
      thumbnail: "/testimonials/mehdi-thumb.jpg",
      quote: "Les projets collaboratifs de l'association m'ont préparé aux défis du monde professionnel. Une expérience enrichissante !",
      year: "Promo 2021",
      achievement: "Prix innovation"
    },
    {
      id: 3,
      name: "Fatima Zahra",
      role: "Étudiante Génie Électrique",
      company: "École Nationale d'Ingénieurs",
      video: "/testimonials/fatima-zahra.mp4",
      thumbnail: "/testimonials/fatima-thumb.jpg",
      quote: "Grâce à GENI, j'ai découvert ma passion pour l'entrepreneuriat et participé à des concours nationaux.",
      year: "Promo 2024",
      achievement: "Concours gagné"
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Membres actifs" },
    { icon: Award, value: "50+", label: "Projets réalisés" },
    { icon: Zap, value: "95%", label: "Taux de satisfaction" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-emerald-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Users className="text-yellow-300" size={20} />
            <span className="text-white font-medium">Association GENI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Témoignages de nos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500"> Membres</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez comment l'association GENI transforme l'expérience étudiante et prépare aux défis de demain
          </p>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <stat.icon className="text-yellow-300 mx-auto mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-emerald-200">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Video Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105"
            >
              {/* Video Thumbnail */}
              <div className="relative cursor-pointer overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-3 group-hover:bg-white/20 transition-colors">
                      <Play className="text-white mx-auto" size={32} />
                    </div>
                    <p className="text-white font-medium">Voir le témoignage</p>
                  </div>
                </div>
                
                {/* Achievement Badge */}
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {testimonial.achievement}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm font-medium">{testimonial.company}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full">
                      {testimonial.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Témoignage à la une
          </h3>
          
          <div className="relative">
            <div className="text-center max-w-4xl mx-auto">
              <Quote className="text-emerald-400 mx-auto mb-6" size={48} />
              <p className="text-gray-300 text-xl italic mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {testimonials[currentTestimonial].name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-emerald-400 text-sm font-medium">
                    {testimonials[currentTestimonial].year}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-colors"
              >
                <ChevronLeft className="text-white" size={20} />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial 
                        ? 'bg-emerald-400' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-3 transition-colors"
              >
                <ChevronRight className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;