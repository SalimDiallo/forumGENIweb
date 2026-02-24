'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';

const PresidentMessage = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-neutral-200 rounded-full mb-5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-600 font-medium text-xs uppercase tracking-wider">
                Mot du Président
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Vision et Engagement
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              Un message d'inspiration pour nos étudiants et nos partenaires
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* President Image */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative">
                {/* Image */}
                <div className="relative aspect-[4/5] w-full max-w-sm mx-auto lg:mx-0 overflow-hidden">
                  <Image
                    src="/team/2026/walid.jpg"
                    alt="Président du Forum GENI Entreprise"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-neutral-50 p-6 max-w-sm mx-auto lg:mx-0">
                  <h3 className="font-semibold text-neutral-900 text-lg mb-1">
                    M. Walid Kilani
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Président du Forum GENI Entreprise
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Message Content */}
            <motion.div
              className="lg:col-span-3 flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-6 text-neutral-700">
                <p className="text-lg md:text-xl leading-relaxed">
                  <span className="font-medium text-neutral-900">Chers étudiants, chers partenaires,</span>
                </p>

                <p className="text-base md:text-lg leading-relaxed">
                  Le Forum GENI Entreprise représente bien plus qu'un simple événement :
                  c'est une passerelle entre le monde académique et le monde professionnel,
                  un espace de rencontre et d'échange qui façonne l'avenir de nos ingénieurs.
                </p>

                <p className="text-base md:text-lg leading-relaxed">
                  Depuis sa création, notre forum n'a cessé de grandir et d'évoluer,
                  reflétant ainsi la dynamique et l'engagement de notre école. Chaque édition
                  est l'occasion de tisser des liens durables entre nos étudiants et les
                  entreprises leaders de divers secteurs.
                </p>

                <p className="text-base md:text-lg leading-relaxed">
                  Je vous invite à découvrir les opportunités exceptionnelles que nous
                  offrons et à vous joindre à nous pour construire ensemble un avenir
                  professionnel prometteur.
                </p>

                {/* Signature */}
                <div className="pt-8 mt-8 border-t border-neutral-200">
                  <p className="font-semibold text-neutral-900 text-base">
                    Walid Kilani
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Président
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidentMessage;
