'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  withBlur?: boolean;
  subtitle?: string;
  image?: string;
  badge?: string;
}

const PageHero = ({
  title,
  withBlur = true,
  subtitle,
  image = '/insea-building.jpg',
  badge
}: PageHeroProps) => {
  return (
    <section className="relative h-[calc(65vh+5rem)] min-h-[530px] max-h-[730px] flex items-center justify-center -mt-20 pt-20">
      {/* Image de fond qui couvre toute la section y compris la zone du header */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-emerald-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
      </motion.div>

      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJibGVuY2UgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiB0eXBlPSJmcmFjdGFsTm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHBhdGggZD0iTTAgMGgzMDB2MzAwSDB6IiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')]" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex"
          >
            <div className="relative group">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full mb-6 shadow-lg hover:bg-emerald-500/15 transition-all duration-300">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-semibold text-sm tracking-wide">{badge}</span>
              </div>
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 tracking-tight"
        >
          <span className="block bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_30px_rgb(0_0_0_/_50%)]">
            {title}
          </span>
        </motion.h1>

        {/* Ligne décorative avec animation */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent w-16 md:w-24"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent w-16 md:w-24"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}

        {/* Sous-titre avec animation */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg lg:text-xl text-white/95 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Effet de lumière subtil en bas */}
    {withBlur && (
      <>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </>
    )}

    </section>
  );
};

export default PageHero;
