'use client';

import { motion } from 'framer-motion';

const GeniMeaning = () => {
  // Use a single shade of green for all elements (less color, pas trop de couleur)
  const letterColor = 'text-green-700/90';
  const barColor = 'bg-green-600';
  const hoverGlow = 'bg-green-500';

  const letters = [
    {
      letter: 'G',
      word: 'Grandes',
      delay: 0
    },
    {
      letter: 'E',
      word: 'Écoles',
      delay: 0.1
    },
    {
      letter: 'N',
      word: 'Nationales',
      delay: 0.2
    },
    {
      letter: 'I',
      word: "d'Ingénieurs",
      delay: 0.3
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-neutral-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-neutral-400 text-sm md:text-base font-medium uppercase tracking-wider mb-6">
              Notre Identité
            </p>
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              Qu'est-ce que GENI ?
            </h2>
          </motion.div>

          {/* GENI Letters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {letters.map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                {/* Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col items-center justify-center text-center">
                  {/* Letter */}
                  <div className={`text-8xl md:text-9xl font-black ${letterColor} mb-4`}>
                    {item.letter}
                  </div>

                  {/* Word */}
                  <div className="mt-4">
                    <p className="text-white text-xl md:text-2xl font-semibold">
                      {item.word}
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className={`w-12 h-1 ${barColor} rounded-full mt-4`} />
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 ${hoverGlow} rounded-2xl blur-2xl opacity-0 group-hover:opacity-15 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
              </motion.div>
            ))}
          </div>

          {/* Full Name Display */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="bg-primary rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Slight animated overlay for subtle life */}
              <div className="absolute inset-0 bg-primary/40 animate-pulse" />
              <div className="relative z-10">
                <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider mb-3">
                  Signification Complète
                </p>
                <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Grandes Écoles Nationales d'Ingénieurs
                </h3>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="text-center mt-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
              Un forum d’excellence qui fait le lien entre les étudiants ingénieurs des grandes écoles nationales et le monde professionnel, ouvrant la voie aux opportunités, à la collaboration et à l’innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GeniMeaning;
