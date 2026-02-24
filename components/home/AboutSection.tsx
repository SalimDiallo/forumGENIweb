'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-neutral-200 rounded-full mb-5">
              <Info className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-600 font-medium text-xs uppercase tracking-wider">
                À propos
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Forum GENI Entreprise
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              Un événement phare qui connecte les talents de demain aux opportunités d'aujourd'hui
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Image */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 overflow-hidden bg-white p-8">
                <Image
                  src="/logo 2.png"
                  alt="Forum GENI Entreprise"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:col-span-3 flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6">
                <p className="text-lg md:text-xl leading-relaxed text-neutral-700 font-light">
                  Depuis plus de <span className="font-semibold text-neutral-900">15 ans</span>, le Forum GENI Entreprise s'est imposé comme
                  l'événement incontournable qui réunit étudiants, diplômés et entreprises
                  autour d'un objectif commun : construire l'avenir professionnel des ingénieurs.
                </p>

                <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                  Chaque année, nous accueillons les plus grandes entreprises nationales et
                  internationales qui viennent à la rencontre de nos talents pour proposer
                  des opportunités de stages, d'emplois et de partenariats stratégiques.
                </p>

                <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                  Au-delà du simple forum de recrutement, nous organisons des conférences,
                  des ateliers et des rencontres networking qui permettent à nos participants
                  de développer leurs compétences et d'élargir leur réseau professionnel.
                </p>

                {/* CTA */}
                <div className="pt-8 border-t border-neutral-200">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-neutral-900 font-medium hover:gap-3 transition-all group"
                  >
                    <span className="text-base">Découvrir notre histoire</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
