// components/Partners.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react'; 
import Link from 'next/link';

type PartnerCategory = 'platinum' | 'gold';

interface Partner {
  id: number;
  name: string;
  logo: string;
  category: PartnerCategory;
  website: string;
  description: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Attijariwafa bank",
    logo: "https://www.attijariwafabank.com/themes/custom/attijariwafa_bank/logo.png",
    category: "gold",
    website: "https://www.attijariwafabank.com",
    description: "Attijariwafa bank est le premier groupe bancaire et financier du Maghreb. Présent dans 26 pays, il accompagne ses clients entreprises et particuliers avec une offre complète et innovante.",
  },
  {
    id: 2,
    name: "INWI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Inwi_logo.svg",
    category: "gold",
    website: "https://www.inwi.ma/",
    description: "Opérateur global et innovant des télécommunications au Maroc proposant des services mobiles, Internet et solutions professionnelles pour entreprises.",
  },
  {
    id: 3,
    name: "Orange",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Orange_logo.svg/1200px-Orange_logo.svg.png",
    category: "gold",
    website: "https://www.orange.ma/",
    description: "Filiale du Groupe Orange, leader mondial des télécoms, Orange Maroc connecte des millions de Marocains via des offres mobiles, Internet et entreprises.",
  },
  {
    id: 4,
    name: "Office Chérifien des Phosphates (Groupe OCP)",
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/e/e7/OCP_Group_logo.svg/2560px-OCP_Group_logo.svg.png",
    category: "gold",
    website: "https://www.ocpgroup.ma/",
    description: "Leader mondial sur le marché du phosphate et ses dérivés, OCP contribue au développement durable de l'agriculture à l'échelle mondiale depuis près d’un siècle.",
  },
  {
    id: 5,
    name: "Airports Of Morocco",
    logo: "https://www.onda.ma/Style%20Library/images/logo-on.png",
    category: "gold",
    website: "https://www.onda.ma",
    description: "L'Office National Des Aéroports (ONDA) gère, exploite et modernise les aéroports du Maroc pour faciliter la connectivité et favoriser le développement économique national.",
  },
  {
    id: 6,
    name: "Maroc Telecom",
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/7/75/Logo_Maroc_Telecom.svg/2560px-Logo_Maroc_Telecom.svg.png",
    category: "platinum",
    website: "https://www.iam.ma/",
    description: "Premier opérateur télécom du Maroc, Maroc Telecom propose des solutions en téléphonie, Internet et data à destination des particuliers et professionnels.",
  },
  {
    id: 7,
    name: "DXC Technology",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/DXC_Technology_logo.svg/2560px-DXC_Technology_logo.svg.png",
    category: "platinum",
    website: "https://dxc.com/",
    description: "DXC Technology accompagne les plus grandes entreprises mondiales dans leur transformation digitale avec une expertise en IT services et solutions innovantes.",
  },
  {
    id: 8,
    name: "Caisse de Dépôt et de Gestion (CDG)",
    logo: "https://www.cdg.ma/sites/default/files/logo_cdginvest.png",
    category: "platinum",
    website: "https://www.cdg.ma/",
    description: "Institution financière publique marocaine d’investissement, la CDG est un acteur clé du développement économique, social et territorial du Maroc.",
  },
  {
    id: 9,
    name: "Banque Populaire",
    logo: "https://www.gbp.ma/sites/default/files/2021-04/logo-bp.png",
    category: "platinum",
    website: "https://www.gbp.ma/",
    description: "Groupe Banque Populaire est l’un des groupes bancaires majeurs au Maroc, reconnu pour son engagement dans le développement territorial et l’accompagnement de ses clients.",
  },
  {
    id: 10,
    name: "Royal Air Maroc",
    logo: "https://www.royalairmaroc.com/themes/custom/ram/images/Logo.svg",
    category: "platinum",
    website: "https://www.royalairmaroc.com/",
    description: "Compagnie aérienne nationale du Maroc, Royal Air Maroc assure une desserte internationale dense et illustre l’engagement du Maroc pour la connectivité mondiale.",
  },
  {
    id: 11,
    name: "Crédit du Maroc",
    logo: "https://www.creditdumaroc.ma/Style%20Library/assets/logo-cdm.png",
    category: "platinum",
    website: "https://www.creditdumaroc.ma/",
    description: "Crédit du Maroc est une banque universelle marocaine offrant une gamme complète de services à destination des particuliers, professionnels et entreprises.",
  },
  {
    id: 12,
    name: "Orange Business",
    logo: "https://business.orange.ma/img/orange-business-logo.svg",
    category: "platinum",
    website: "https://business.orange.ma/",
    description: "Orange Business propose des solutions digitales et télécoms sur-mesure aux entreprises marocaines pour leur transformation numérique.",
  },
];

const Partners = () => {
  const [activeCategory, setActiveCategory] = useState<PartnerCategory | 'all'>('all');

  const filteredPartners = activeCategory === 'all'
    ? partners
    : partners.filter(partner => partner.category === activeCategory);

  const categoryNames: Record<'all' | PartnerCategory, string> = {
    all: 'Tous les partenaires',
    platinum: 'Partenaires Platinium',
    gold: 'Partenaires Gold'
  };

  return (
    <section className="py-20">
      <div className="absolute left-0 w-1/4 h-64 bg-emerald-800/5 rounded-r-full -z-10"></div>
      <div className="absolute right-0 top-1/2 w-1/3 h-80 bg-emerald-800/5 rounded-l-full -z-10"></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center mb-4 bg-emerald-50 px-3 py-1  border border-emerald-100">
            <span className="text-emerald-800 text-sm font-medium">Ensemble pour l'excellence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Partenaires <span className="text-emerald-800">Stratégiques</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Nous collaborons avec des organisations de premier plan pour créer des opportunités exceptionnelles 
            et façonner l'avenir des professionnels de demain.
          </p>
        </div>
        {/* Filtres de catégories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['all', 'platinum', 'gold'] as const).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2  text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-emerald-800 text-white '
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>
        {/* Grille des partenaires */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          layout
        >
          {filteredPartners.map((partner) => (
            <motion.div
              key={partner.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              className="bg-white  p-6 border border-gray-100 flex flex-col"
            >
              <div className="relative h-24 mb-4 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={240}
                  height={120}
                  className="max-h-24 w-auto object-contain"
                />
                <div className="absolute top-0 right-0">
                  {partner.category === 'platinum' && (
                    <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white text-xs font-bold px-2 py-1 rounded">
                      PLATINIUM
                    </div>
                  )}
                  {partner.category === 'gold' && (
                    <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      GOLD
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">{partner.description}</p>
              <Link
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-emerald-800 hover:text-emerald-900 text-sm font-medium mt-auto"
              >
                Visiter le site
                <ExternalLink size={14} className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {/* Témoignages des partenaires */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Ce que disent nos <span className="text-emerald-800">partenaires</span>
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre collaboration crée de la valeur pour nos partenaires et construit des ponts entre 
              l'excellence académique et le monde professionnel.
            </p>
          </div>
          {/* Carrousel de témoignages */}
          <div className="relative">
            <div className="mx-auto max-w-4xl bg-white  p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32  overflow-hidden flex-shrink-0">
                  <Image 
                    src={partners[0].logo}
                    width={128}
                    height={128}
                    alt={partners[0].name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <svg className="h-10 w-10 text-emerald-100 mb-3" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-700 mb-4 italic">
                    "Notre partenariat avec Forum GENI Entreprises a considérablement renforcé notre marque employeur et nous a permis
                    d'identifier et de recruter des talents exceptionnels. Les événements sont toujours organisés avec 
                    professionnalisme et nous offrent une valeur inestimable."
                  </p>
                  <div>
                    <h4 className="font-bold text-gray-900">Mohammed Amine El Hajjami</h4>
                    <p className="text-emerald-800">DRH, OCP</p>
                  </div>
                </div>
              </div>
              {/* Navigation carrousel (non fonctionnelle) */}
              <div className="flex justify-center mt-8 gap-2">
                <button className="w-8 h-8  bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">
                  <div className="w-2 h-2  bg-emerald-800"></div>
                  <div className="w-2 h-2  bg-emerald-200"></div>
                  <div className="w-2 h-2  bg-emerald-200"></div>
                </div>
                <button className="w-8 h-8  bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;