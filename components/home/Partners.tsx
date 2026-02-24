// components/home/PartnersSimple.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake } from 'lucide-react';
import Link from 'next/link';
import { partners } from '@/lib/data/partners.data';
import { InfiniteScrollRow, PartnerCard } from './InfininityScrollPartner';

// Divide partners array into 3 rows, round robin
function chunkArray<T>(array: T[], parts: number): T[][] {
  const res: T[][] = Array.from({ length: parts }, () => []);
  array.forEach((item, idx) => {
    res[idx % parts].push(item);
  });
  return res;
}

const ROWS = 3;
// Different durations per row for visual appeal (in seconds)
const ROW_DURATIONS = [140, 160,180];

const PartnersSimple = () => {
  const rows = chunkArray(partners, ROWS);


  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `
      }} />
      <section className="py-16 md:py-24 bg-neutral-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-neutral-200 rounded-full mb-5">
              <Handshake className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-600 font-medium text-xs uppercase tracking-wider">Nos Partenaires</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              Des entreprises leaders qui s'engagent à nos côtés pour créer des opportunités exceptionnelles.
            </p>
          </motion.div>
        </div>

        {/* Mobile: Grid view */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>

        {/* Desktop: Infinite scrolling rows */}
        <div className="hidden md:block space-y-8 select-none relative z-0">
          {rows.map((row, i) => {
            const reverse = i % 2 === 1;
            const duration = ROW_DURATIONS[i % ROW_DURATIONS.length];

            return (
              <InfiniteScrollRow
                key={i}
                items={row}
                duration={duration}
                reverse={reverse}
              />
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-neutral-600 mb-3 text-sm md:text-base">
            Vous souhaitez devenir partenaire ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Contactez-nous
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default PartnersSimple;
