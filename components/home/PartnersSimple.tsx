// components/home/PartnersSimple.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake } from 'lucide-react';
import Link from 'next/link';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Attijariwafa bank",
    logo: "/partners/Attijariwafa.png",
    website: "https://www.attijariwafabank.com",
  },
  {
    id: 2,
    name: "INWI",
    logo: "/partners/inwi.png",
    website: "https://www.inwi.ma/",
  },
  {
    id: 3,
    name: "Orange",
    logo: "/partners/orange.png",
    website: "https://www.orange.ma/",
  },
  {
    id: 4,
    name: "Groupe OCP",
    logo: "/partners/ocp.png",
    website: "https://www.ocpgroup.ma/",
  },
  {
    id: 5,
    name: "ONDA",
    logo: "/partners/airports.png",
    website: "https://www.onda.ma",
  },
  {
    id: 6,
    name: "Maroc Telecom",
    logo: "/partners/maroctelecom.png",
    website: "https://www.iam.ma/",
  },
  {
    id: 7,
    name: "DXC Technology",
    logo: "/partners/dxc.png",
    website: "https://dxc.com/",
  },
  {
    id: 8,
    name: "CDG",
    logo: "/partners/cdg.png",
    website: "https://www.cdg.ma/",
  },
  {
    id: 9,
    name: "Banque Populaire",
    logo: "/partners/banquepopulaire.png",
    website: "https://www.gbp.ma/",
  },
  {
    id: 10,
    name: "Royal Air Maroc",
    logo: "/partners/ram.png",
    website: "https://www.royalairmaroc.com/",
  },
  {
    id: 11,
    name: "Crédit du Maroc",
    logo: "/partners/creditdumaroc.png",
    website: "https://www.creditdumaroc.ma/",
  },
  {
    id: 12,
    name: "Orange Business",
    logo: "/partners/orangebusiness.png",
    website: "https://business.orange.ma/",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const PartnersSimple = () => {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-100 rounded-full mb-6">
              <Handshake className="w-4 h-4 text-neutral-600" />
              <span className="text-neutral-700 font-medium text-sm">Nos Partenaires</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
              Ils nous font <span className="text-emerald-600">confiance</span>
            </h2>
            
            <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
              Des entreprises leaders qui s'engagent à nos côtés pour créer des opportunités 
              exceptionnelles et façonner l'avenir.
            </p>
          </motion.div>
        </div>

        {/* Partners Grid - Logo focused */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={itemVariants}
            >
              <Link
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 h-40 md:h-48 flex items-center justify-center transition-all duration-300 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1">
                  {/* Logo */}
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={240}
                    height={120}
                    className="max-h-20 md:max-h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Hover overlay with name */}
                  <div className="absolute inset-0 bg-neutral-900/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <span className="text-white font-semibold text-sm md:text-base text-center px-2 mb-2">
                      {partner.name}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <span>Visiter</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-neutral-500 mb-4">
            Vous souhaitez devenir partenaire ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-full hover:bg-neutral-800 transition-colors"
          >
            Contactez-nous
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSimple;
