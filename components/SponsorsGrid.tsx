'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Sponsor {
  name: string;
  logo: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
}

interface SponsorsGridProps {
  sponsors: Sponsor[];
}

const SponsorsGrid = ({ sponsors }: SponsorsGridProps) => {
  // Grouper les sponsors par tier si défini
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    const tier = sponsor.tier || 'standard';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ['platinum', 'gold', 'silver', 'bronze', 'standard'];
  const sortedTiers = tierOrder.filter(tier => groupedSponsors[tier]);

  const getTierTitle = (tier: string) => {
    const titles: Record<string, string> = {
      platinum: 'Sponsors Platine',
      gold: 'Sponsors Or',
      silver: 'Sponsors Argent',
      bronze: 'Sponsors Bronze',
      standard: 'Partenaires'
    };
    return titles[tier] || 'Partenaires';
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      platinum: 'from-slate-200 to-slate-400',
      gold: 'from-amber-200 to-amber-400',
      silver: 'from-gray-300 to-gray-400',
      bronze: 'from-orange-300 to-orange-400',
      standard: 'from-emerald-200 to-emerald-300'
    };
    return colors[tier] || 'from-emerald-200 to-emerald-300';
  };

  return (
    <div className="space-y-12">
      {sortedTiers.map((tier, tierIndex) => (
        <div key={tier}>
          {/* Titre du tier (sauf si standard et unique) */}
          {!(tier === 'standard' && sortedTiers.length === 1) && (
            <div className="text-center mb-6">
              <div className={`inline-block px-6 py-2 bg-gradient-to-r ${getTierColor(tier)} rounded-full shadow-md mb-2`}>
                <h3 className="text-lg font-bold text-gray-800">{getTierTitle(tier)}</h3>
              </div>
            </div>
          )}

          {/* Grille des sponsors */}
          <div className={`grid gap-4 ${
            tier === 'platinum'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
              : tier === 'gold'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {groupedSponsors[tier].map((sponsor, index) => (
              <motion.div
                key={sponsor.name + index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: tierIndex * 0.1 + index * 0.05 }}
                className="group"
              >
                <a
                  href={sponsor.website || '#'}
                  target={sponsor.website ? '_blank' : undefined}
                  rel={sponsor.website ? 'noopener noreferrer' : undefined}
                  className={`block relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:border-emerald-400 hover:shadow-xl ${
                    tier === 'platinum' ? 'h-40 sm:h-48' : tier === 'gold' ? 'h-32 sm:h-40' : 'h-24 sm:h-32'
                  }`}
                >
                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500 pointer-events-none"></div>

                  {/* Logo */}
                  <div className="relative w-full h-full p-4 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                        sizes={tier === 'platinum' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                      />
                    </div>
                  </div>

                  {/* Badge du nom au hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                    <p className="text-white text-sm font-semibold text-center truncate">
                      {sponsor.name}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SponsorsGrid;
