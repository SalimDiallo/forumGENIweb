// components/Hero.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ChevronRight, MapPin, Briefcase, LineChart } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Image de l'INSEA en arrière-plan */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/insea-building.jpg')"
        }}
      >
        {/* Overlay pour améliorer la lisibilité du contenu */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-green-800/15 to-green-900/25"></div>
      </div>
      
      {/* Bande décorative supérieure */}
      <div className="absolute top-0 left-0 w-full h-3 bg-green-800 z-10"></div>
      
      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          {/* Logo principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Image
              src="/logo 4.png"
              alt="Forum GENI Entreprises"
              width={200}
              height={240}
              className="h-32 w-auto drop-shadow-2xl"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="inline-flex items-center p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="px-3 py-1 text-sm font-medium bg-green-800 text-white rounded-full">
                Depuis 2002
              </span>
              <span className="px-3 text-white font-medium">
                Association professionnelle de l'INSEA
              </span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            <span className="block">Forum GENI INSEA</span>
            <span className="text-green-200">Expertise • Innovation • Leadership</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl text-white/90 max-w-3xl mb-8"
          >
            La convergence entre l'excellence académique de l'INSEA et les leaders du monde professionnel.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
          >
            <Link href="/events" prefetch={true} className="flex-1">
              <motion.button 
                className="w-full py-4 bg-white text-green-800 font-medium rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Participer au Forum 2025
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link href="/events" prefetch={true} className="flex-1">
              <motion.button 
                className="w-full py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Découvrir nos événements
              </motion.button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 py-6 px-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-green-800 text-white rounded-full">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Forum Annuel 2025</h3>
              <p className="text-white/80">3-5 mai 2025 • INSEA Rabat</p>
            </div>
            
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-green-800 text-white rounded-full">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Réseau professionnel</h3>
              <p className="text-white/80">500+ experts et leaders du secteur</p>
            </div>
            
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-green-800 text-white rounded-full">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Expertise INSEA</h3>
              <p className="text-white/80">Pôle d'excellence académique</p>
            </div>
            
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-green-800 text-white rounded-full">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Contactez-nous</h3>
              <p className="text-white/80">Partenariats professionnels</p>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white z-10"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <p className="text-sm mb-2 text-white/70">Découvrir plus</p>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 7L12 12L17 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      
      {/* Pour une vraie implémentation, vous pourriez utiliser ce code pour une vidéo HTML5 */}
      {/* 
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la balise vidéo.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/80 to-green-900/70"></div>
      </div>
      */}
    </section>
  );
};

export default Hero;