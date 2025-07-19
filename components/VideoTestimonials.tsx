'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Quote } from 'lucide-react';

const VideoTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Bennani",
      role: "CEO, StartUp Innovante",
      company: "TechVision",
      video: "/testimonials/sarah-bennani.mp4",
      thumbnail: "/testimonials/sarah-thumb.jpg",
      quote: "Le Forum GENI Entreprises a été un tournant dans ma carrière. J'y ai rencontré mes premiers investisseurs.",
      year: "Alumni 2019"
    },
    {
      id: 2,
      name: "Mehdi Alaoui",
      role: "Directeur Innovation",
      company: "Groupe OCP",
      video: "/testimonials/mehdi-alaoui.mp4",
      thumbnail: "/testimonials/mehdi-thumb.jpg",
      quote: "Une plateforme exceptionnelle pour identifier les talents et créer des partenariats durables.",
      year: "Partenaire depuis 2016"
    },
    {
      id: 3,
      name: "Fatima Zahra",
      role: "Data Scientist",
      company: "Attijariwafa Bank",
      video: "/testimonials/fatima-zahra.mp4",
      thumbnail: "/testimonials/fatima-thumb.jpg",
      quote: "Les connexions que j'ai faites au forum continuent d'enrichir ma carrière aujourd'hui.",
      year: "Alumni 2021"
    }
  ];

  return (
    <section className="py-20 bg-green-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Témoignages Vidéo
          </h2>
          <p className="text-xl text-green-200 max-w-3xl mx-auto">
            Découvrez l'impact du Forum GENI Entreprises à travers les témoignages de nos participants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20"
            >
              {/* Thumbnail vidéo */}
              <div className="relative group cursor-pointer">
                <div className="aspect-video bg-green-700 rounded-t-xl flex items-center justify-center">
                  <div className="text-center">
                    <Play className="text-white mx-auto mb-2" size={48} />
                    <p className="text-white font-medium">Cliquez pour regarder</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Play className="text-white" size={64} />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Quote className="text-green-200 flex-shrink-0" size={24} />
                  <p className="text-white italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-white font-bold">{testimonial.name}</h3>
                  <p className="text-green-200 text-sm">{testimonial.role}</p>
                  <p className="text-green-200 text-sm">{testimonial.company}</p>
                  <p className="text-green-300 text-xs mt-2">{testimonial.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section témoignages texte */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Ce qu'ils disent de nous
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Quote className="text-green-200 mx-auto mb-4" size={32} />
              <p className="text-white italic mb-4">
                "Le Forum GENI Entreprises est devenu un rendez-vous incontournable pour 
                notre stratégie de recrutement. La qualité des profils est exceptionnelle."
              </p>
              <div className="text-green-200">
                <p className="font-semibold">Karim Benali</p>
                <p className="text-sm">DRH, Royal Air Maroc</p>
              </div>
            </div>
            
            <div className="text-center">
              <Quote className="text-green-200 mx-auto mb-4" size={32} />
              <p className="text-white italic mb-4">
                "Grâce au Forum, j'ai pu présenter mon projet à des investisseurs qui ont 
                cru en ma vision. Aujourd'hui, mon entreprise emploie 25 personnes."
              </p>
              <div className="text-green-200">
                <p className="font-semibold">Amina Riffi</p>
                <p className="text-sm">Fondatrice, GreenTech Solutions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
