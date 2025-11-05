'use client';

import React, { useState } from 'react';
import { Play, Quote, Users, Award, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

type TestimonialData = {
  id: number;
  name: string;
  position: string | null;
  company: string | null;
  graduationYear: number | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  quote: string | null;
  fullTranscript: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

type VideoTestimonialsProps = {
  testimonials: TestimonialData[];
};

const VideoTestimonials = ({ testimonials }: VideoTestimonialsProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Transform database testimonials to display format
  const displayTestimonials = testimonials.map(testimonial => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.position || 'Membre',
    company: testimonial.company || 'INSEA',
    video: testimonial.videoUrl,
    thumbnail: testimonial.thumbnailUrl || '/testimonials/default-thumb.jpg',
    quote: testimonial.quote || 'Une expérience formidable avec l\'association GENI.',
    year: testimonial.graduationYear ? `Promo ${testimonial.graduationYear}` : 'INSEA',
    achievement: testimonial.isFeatured ? 'Témoignage vedette' : 'Membre actif',
  }));

  const stats = [
    { icon: Users, value: "500+", label: "Membres actifs" },
    { icon: Award, value: "50+", label: "Projets réalisés" },
    { icon: Zap, value: "95%", label: "Taux de satisfaction" }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-600 rounded-full blur-3xl"></div>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700"> Membres</span>
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
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-600/40 transition-all duration-300 hover:scale-105"
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
                <div className="absolute top-3 right-3 bg-emerald-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {testimonial.achievement}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm font-medium">{testimonial.company}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-emerald-600 text-xs font-semibold bg-emerald-600/10 px-2 py-1 rounded-full">
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
              <Quote className="text-emerald-600 mx-auto mb-6" size={48} />
              <p className="text-gray-300 text-xl italic mb-8 leading-relaxed">
                "{displayTestimonials[currentTestimonial]?.quote || ''}"
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {displayTestimonials[currentTestimonial]?.name.charAt(0) || 'G'}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg">
                    {displayTestimonials[currentTestimonial]?.name || ''}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {displayTestimonials[currentTestimonial]?.role || ''}
                  </p>
                  <p className="text-emerald-600 text-sm font-medium">
                    {displayTestimonials[currentTestimonial]?.year || ''}
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
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial
                        ? 'bg-emerald-600'
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