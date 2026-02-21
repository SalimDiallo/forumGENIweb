// components/Partners.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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
    name: "Attijariwafa Bank",
    logo: "https://placehold.co/240x120?text=Attijariwafa+Bank",
    category: "gold",
    website: "https://www.attijariwafabank.com",
    description: "Attijariwafa bank est le premier groupe bancaire et financier du Maghreb.",
  },
  {
    id: 2,
    name: "Bank of Africa",
    logo: "https://placehold.co/240x120?text=Bank+of+Africa",
    category: "gold",
    website: "https://www.bankofafrica.ma/",
    description: "Bank of Africa, groupe bancaire panafricain de référence, engagée dans l’innovation et le développement du continent.",
  },
  {
    id: 3,
    name: "inwi",
    logo: "https://placehold.co/240x120?text=inwi",
    category: "gold",
    website: "https://www.inwi.ma/",
    description: "Opérateur global innovant, leader dans la télécommunication au Maroc.",
  },
  {
    id: 4,
    name: "Orange",
    logo: "https://placehold.co/240x120?text=Orange",
    category: "gold",
    website: "https://www.orange.ma/",
    description: "Grand groupe télécom, Orange Maroc propose des solutions mobiles et Internet.",
  },
  {
    id: 5,
    name: "ONCF",
    logo: "https://placehold.co/240x120?text=ONCF",
    category: "gold",
    website: "https://www.oncf.ma/",
    description: "Office National des Chemins de Fer, opérateur ferroviaire marocain.",
  },
  {
    id: 6,
    name: "Banque Populaire",
    logo: "https://placehold.co/240x120?text=Banque+Populaire",
    category: "platinum",
    website: "https://www.gbp.ma/",
    description: "Groupe Banque Populaire, acteur bancaire majeur au Maroc.",
  },
  {
    id: 7,
    name: "Huawei",
    logo: "https://placehold.co/240x120?text=Huawei",
    category: "gold",
    website: "https://www.huawei.com/ma/",
    description: "Leader mondial des infrastructures des technologies de l’information et de la communication.",
  },
  {
    id: 8,
    name: "Crédit du Maroc",
    logo: "https://placehold.co/240x120?text=Crédit+du+Maroc",
    category: "platinum",
    website: "https://www.creditdumaroc.ma/",
    description: "Banque universelle offrant une gamme complète de services.",
  },
  {
    id: 9,
    name: "KPMG",
    logo: "https://placehold.co/240x120?text=KPMG",
    category: "platinum",
    website: "https://home.kpmg/ma/fr/home.html",
    description: "Cabinet mondial d'audit, de conseil et d'expertise comptable.",
  },
  {
    id: 10,
    name: "S2M",
    logo: "https://placehold.co/240x120?text=S2M",
    category: "gold",
    website: "https://www.s2m.ma/",
    description: "Solutions monétiques et digitales sécurisées.",
  },
  {
    id: 11,
    name: "Cnexia",
    logo: "https://placehold.co/240x120?text=Cnexia",
    category: "gold",
    website: "https://www.cnexia.ma/",
    description: "Centre d’expertise digital, filiale du groupe Altice.",
  },
  {
    id: 12,
    name: "DXC Technology",
    logo: "https://placehold.co/240x120?text=DXC+Technology",
    category: "platinum",
    website: "https://dxc.com/",
    description: "Accompagnement des entreprises dans leur transformation digitale.",
  },
  {
    id: 13,
    name: "SIANA",
    logo: "https://placehold.co/240x120?text=SIANA",
    category: "gold",
    website: "https://www.siana.ma/",
    description: "Operateur et intégrateur multi-technologique.",
  },
  {
    id: 14,
    name: "Axelor",
    logo: "https://placehold.co/240x120?text=Axelor",
    category: "gold",
    website: "https://www.axelor.com/",
    description: "Plateforme low code et solutions ERP innovantes.",
  },
  {
    id: 15,
    name: "SOREC",
    logo: "https://placehold.co/240x120?text=SOREC",
    category: "gold",
    website: "https://www.sorec.ma/",
    description: "Société Royale d’Encouragement du Cheval.",
  },
  {
    id: 16,
    name: "Capgemini",
    logo: "https://placehold.co/240x120?text=Capgemini",
    category: "platinum",
    website: "https://www.capgemini.com/ma-fr/",
    description: "Leader mondial des services de conseil, de transformation numérique et d’ingénierie.",
  },
  {
    id: 17,
    name: "Société Générale",
    logo: "https://placehold.co/240x120?text=Société+Générale",
    category: "gold",
    website: "https://www.societegenerale.ma/",
    description: "Acteur majeur du secteur bancaire marocain et international.",
  },
  {
    id: 18,
    name: "RMA",
    logo: "https://placehold.co/240x120?text=RMA",
    category: "gold",
    website: "https://www.rmaassurance.com/",
    description: "Assurance multirisque et solutions innovantes.",
  },
  {
    id: 19,
    name: "BCG",
    logo: "https://placehold.co/240x120?text=BCG",
    category: "platinum",
    website: "https://www.bcg.com/fr-ma",
    description: "Boston Consulting Group, leader mondial du conseil en stratégie.",
  },
  {
    id: 20,
    name: "ACAPS",
    logo: "https://placehold.co/240x120?text=ACAPS",
    category: "gold",
    website: "https://www.acaps.ma/",
    description: "Autorité de Contrôle des Assurances et de la Prévoyance Sociale.",
  },
  {
    id: 21,
    name: "Deloitte",
    logo: "https://placehold.co/240x120?text=Deloitte",
    category: "platinum",
    website: "https://www2.deloitte.com/ma/fr.html",
    description: "Cabinet international d’audit & de conseil financier.",
  },
  {
    id: 22,
    name: "IDEMIA",
    logo: "https://placehold.co/240x120?text=IDEMIA",
    category: "gold",
    website: "https://www.idemia.com/",
    description: "Numéro un mondial de l'identité augmentée.",
  },
  {
    id: 23,
    name: "CFG Bank",
    logo: "https://placehold.co/240x120?text=CFG+Bank",
    category: "gold",
    website: "https://www.cfgbank.com/",
    description: "Groupe bancaire et financier marocain.",
  },
  {
    id: 24,
    name: "LabelVie",
    logo: "https://placehold.co/240x120?text=LabelVie",
    category: "gold",
    website: "https://www.labelvie.ma/",
    description: "Groupe de grande distribution multiformat au Maroc.",
  },
  {
    id: 25,
    name: "VISEO",
    logo: "https://placehold.co/240x120?text=VISEO",
    category: "gold",
    website: "https://www.viseo.com/fr",
    description: "Société de conseil en transformation digitale.",
  },
  {
    id: 26,
    name: "Rekrute",
    logo: "https://placehold.co/240x120?text=Rekrute",
    category: "gold",
    website: "https://www.rekrute.com/",
    description: "Leader marocain des solutions e-recrutement.",
  },
  {
    id: 27,
    name: "Intelcia",
    logo: "https://placehold.co/240x120?text=Intelcia",
    category: "gold",
    website: "https://www.intelcia.com/",
    description: "Expert en outsourcing et expérience client.",
  },
  {
    id: 28,
    name: "PortNet",
    logo: "https://placehold.co/240x120?text=PortNet",
    category: "gold",
    website: "https://www.portnet.ma/",
    description: "Guichet Unique National Portuaire.",
  },
  {
    id: 29,
    name: "Sanlam",
    logo: "https://placehold.co/240x120?text=Sanlam",
    category: "gold",
    website: "https://www.sanlam.ma/",
    description: "Groupe d'assurance international.",
  },
  {
    id: 30,
    name: "CIH Bank",
    logo: "https://placehold.co/240x120?text=CIH+Bank",
    category: "gold",
    website: "https://www.cihbank.ma/",
    description: "Banque de l’innovation bancaire et digitale.",
  },
  {
    id: 31,
    name: "AXA",
    logo: "https://placehold.co/240x120?text=AXA",
    category: "gold",
    website: "https://www.axa.ma/",
    description: "Leader mondial de l'assurance.",
  },
  {
    id: 32,
    name: "Sofrecom",
    logo: "https://placehold.co/240x120?text=Sofrecom",
    category: "gold",
    website: "https://www.sofrecom.com/",
    description: "Conseil et ingénierie en télécoms.",
  },
  {
    id: 33,
    name: "Netopia",
    logo: "https://placehold.co/240x120?text=Netopia",
    category: "gold",
    website: "https://www.netopia.com/",
    description: "Solutions de paiement et services digitaux.",
  },
  {
    id: 34,
    name: "AFD Tech",
    logo: "https://placehold.co/240x120?text=AFD+Tech",
    category: "gold",
    website: "https://afdtech.com/",
    description: "Ingénierie et conseil en nouvelles technologies.",
  },
  {
    id: 35,
    name: "Al Barid Bank",
    logo: "https://placehold.co/240x120?text=Al+Barid+Bank",
    category: "gold",
    website: "https://www.albaridbank.ma/",
    description: "Banque citoyenne, filiale de Barid Al Maghrib.",
  },
  {
    id: 36,
    name: "Wafa Assurance",
    logo: "https://placehold.co/240x120?text=Wafa+Assurance",
    category: "gold",
    website: "https://www.wafaassurance.ma/",
    description: "Leader marocain de l’assurance multirisque.",
  },
  {
    id: 37,
    name: "Managem",
    logo: "https://placehold.co/240x120?text=Managem",
    category: "gold",
    website: "https://www.managemgroup.com/",
    description: "Groupe minier marocain.",
  },
  {
    id: 38,
    name: "ADRIA",
    logo: "https://placehold.co/240x120?text=ADRIA",
    category: "gold",
    website: "https://www.adria.ma/",
    description: "Services IT et ingénierie informatique.",
  },
  {
    id: 39,
    name: "HPS",
    logo: "https://placehold.co/240x120?text=HPS",
    category: "gold",
    website: "https://www.hps-worldwide.com/",
    description: "Solutions de paiement électronique.",
  },
  {
    id: 40,
    name: "MAP",
    logo: "https://placehold.co/240x120?text=MAP",
    category: "gold",
    website: "https://www.mapnews.ma/",
    description: "Agence Maghreb Arabe Presse, agence officielle d’information.",
  },
  {
    id: 41,
    name: "Cegedim",
    logo: "https://placehold.co/240x120?text=Cegedim",
    category: "gold",
    website: "https://www.cegedim.com/",
    description: "Innovation dans la data et la santé.",
  },
  {
    id: 42,
    name: "NBS Consulting",
    logo: "https://placehold.co/240x120?text=NBS+Consulting",
    category: "gold",
    website: "https://www.nbs-consulting.com/",
    description: "Conseil en IT et stratégie digitale.",
  },
  {
    id: 43,
    name: "MAScIR",
    logo: "https://placehold.co/240x120?text=MAScIR",
    category: "gold",
    website: "https://www.mascir.com/",
    description: "Recherche et Innovation appliquée.",
  },
  {
    id: 44,
    name: "Formind",
    logo: "https://placehold.co/240x120?text=Formind",
    category: "gold",
    website: "https://www.formind.fr/",
    description: "Cabinet de conseil en cybersécurité.",
  },
  {
    id: 45,
    name: "DACHSER",
    logo: "https://placehold.co/240x120?text=DACHSER",
    category: "gold",
    website: "https://www.dachser.com/",
    description: "Logistique, transport et supply chain international.",
  },
  {
    id: 46,
    name: "Fondation Arrawaj",
    logo: "https://placehold.co/240x120?text=Fondation+Arrawaj",
    category: "gold",
    website: "https://www.arrawaj.ma/",
    description: "Micro-finance, développement social et économique.",
  },
  {
    id: 47,
    name: "Cercle RH",
    logo: "https://placehold.co/240x120?text=Cercle+RH",
    category: "gold",
    website: "https://www.cerclerh.ma/",
    description: "Cabinet de recrutement, ressources humaines.",
  },
  {
    id: 48,
    name: "ScreenDy",
    logo: "https://placehold.co/240x120?text=ScreenDy",
    category: "gold",
    website: "https://www.screendy.com/",
    description: "Plateforme No Code de réalisation d’applications mobiles.",
  },
  {
    id: 49,
    name: "ESSEC Business School",
    logo: "https://placehold.co/240x120?text=ESSEC+Business+School",
    category: "platinum",
    website: "https://www.essec.edu/",
    description: "Grande école de commerce internationale.",
  },
  {
    id: 50,
    name: "KEDGE Business School",
    logo: "https://placehold.co/240x120?text=KEDGE+Business+School",
    category: "gold",
    website: "https://kedge.edu/",
    description: "Ecole de commerce internationale.",
  },
  {
    id: 51,
    name: "Université Laval",
    logo: "https://placehold.co/240x120?text=Université+Laval",
    category: "gold",
    website: "https://www.ulaval.ca/",
    description: "Université francophone canadienne.",
  },
  {
    id: 52,
    name: "NextXP",
    logo: "https://placehold.co/240x120?text=NextXP",
    category: "gold",
    website: "https://www.nextxp.com/",
    description: "Conseil et accompagnement digital.",
  },
  {
    id: 53,
    name: "OKADIA",
    logo: "https://placehold.co/240x120?text=OKADIA",
    category: "gold",
    website: "https://www.okadia.ma/",
    description: "Transformation digitale et innovante.",
  },
  {
    id: 54,
    name: "CMGP",
    logo: "https://placehold.co/240x120?text=CMGP",
    category: "gold",
    website: "https://www.cmgp.ma/",
    description: "Solutions pour l’irrigation et l’agriculture au Maroc.",
  },
  {
    id: 55,
    name: "Novancy One",
    logo: "https://placehold.co/240x120?text=Novancy+One",
    category: "gold",
    website: "https://www.novancy.com/",
    description: "Cabinet de recrutement IT & Digital.",
  },
  {
    id: 56,
    name: "Zodiac Aerospace",
    logo: "https://placehold.co/240x120?text=Zodiac+Aerospace",
    category: "gold",
    website: "https://www.safran-group.com/companies/zodiac-aerospace",
    description: "Équipements aérospatiaux innovants.",
  },
  {
    id: 57,
    name: "CDG Capital",
    logo: "https://placehold.co/240x120?text=CDG+Capital",
    category: "platinum",
    website: "https://www.cdgcapital.ma/",
    description: "Banque d’investissement du groupe CDG.",
  },
  {
    id: 58,
    name: "Accolade Center",
    logo: "https://placehold.co/240x120?text=Accolade+Center",
    category: "gold",
    website: "https://accoladecenter.ma/",
    description: "Centre de formation et accompagnement RH.",
  },
  {
    id: 59,
    name: "ANRT",
    logo: "https://placehold.co/240x120?text=ANRT",
    category: "gold",
    website: "https://www.anrt.ma/",
    description: "Agence Nationale de Réglementation des Télécommunications.",
  },
  {
    id: 60,
    name: "Haut-Commissariat au Plan",
    logo: "https://placehold.co/240x120?text=Haut+Commissariat+au+Plan",
    category: "gold",
    website: "https://www.hcp.ma/",
    description: "Institution publique de la planification au Maroc.",
  },
  {
    id: 61,
    name: "DDM",
    logo: "https://placehold.co/240x120?text=DDM",
    category: "gold",
    website: "#",
    description: "Institution/organisation partenaire.",
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
          <div className="inline-flex items-center mb-4 bg-emerald-50 px-3 py-1 border border-emerald-100">
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
              className={`px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-emerald-800 text-white'
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
              className="bg-white p-6 border border-gray-100 flex flex-col"
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
              {partner.website && partner.website !== "#" && (
                <Link
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-emerald-800 hover:text-emerald-900 text-sm font-medium mt-auto"
                >
                  Visiter le site
                  <ExternalLink size={14} className="ml-1" />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;