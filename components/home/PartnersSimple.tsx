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
    name: "Attijariwafa Bank",
    logo: "/partners/Attijariwafa.png",
    website: "https://www.attijariwafabank.com",
  },
  {
    id: 2,
    name: "Bank of Africa",
    logo: "/partners/bankofafrica.png",
    website: "https://www.bankofafrica.ma/",
  },
  {
    id: 3,
    name: "inwi",
    logo: "/partners/inwi.png",
    website: "https://www.inwi.ma/",
  },
  {
    id: 4,
    name: "Orange",
    logo: "/partners/orange.png",
    website: "https://www.orange.ma/",
  },
  {
    id: 5,
    name: "ONCF",
    logo: "/partners/oncf.png",
    website: "https://www.oncf.ma/",
  },
  {
    id: 6,
    name: "Banque Populaire",
    logo: "/partners/banquepopulaire.png",
    website: "https://www.gbp.ma/",
  },
  {
    id: 7,
    name: "Huawei",
    logo: "/partners/huawei.png",
    website: "https://www.huawei.com/ma/",
  },
  {
    id: 8,
    name: "Crédit du Maroc",
    logo: "/partners/creditdumaroc.png",
    website: "https://www.creditdumaroc.ma/",
  },
  {
    id: 9,
    name: "KPMG",
    logo: "/partners/kpmg.png",
    website: "https://home.kpmg/ma/fr/home.html",
  },
  {
    id: 10,
    name: "S2M",
    logo: "/partners/s2m.png",
    website: "https://www.s2mgroup.com/",
  },
  {
    id: 11,
    name: "Cnexia",
    logo: "/partners/cnexia.png",
    website: "https://www.cnexia.ma/",
  },
  {
    id: 12,
    name: "DXC Technology",
    logo: "/partners/dxc.png",
    website: "https://dxc.com/",
  },
  {
    id: 13,
    name: "SIANA",
    logo: "/partners/siana.png",
    website: "https://www.siana.ma/",
  },
  {
    id: 14,
    name: "Axelor",
    logo: "/partners/axelor.png",
    website: "https://www.axelor.com/",
  },
  {
    id: 15,
    name: "SOREC",
    logo: "/partners/sorec.png",
    website: "https://www.sorec.ma/",
  },
  {
    id: 16,
    name: "Capgemini",
    logo: "/partners/capgemini.png",
    website: "https://www.capgemini.com/ma-fr/",
  },
  {
    id: 17,
    name: "Société Générale",
    logo: "/partners/societegenerale.png",
    website: "https://www.societegenerale.ma/",
  },
  {
    id: 18,
    name: "RMA",
    logo: "/partners/rma.png",
    website: "https://www.rmaassurance.com/",
  },
  {
    id: 19,
    name: "BCG",
    logo: "/partners/bcg.png",
    website: "https://www.bcg.com/fr-ma",
  },
  {
    id: 20,
    name: "ACAPS",
    logo: "/partners/acaps.png",
    website: "https://www.acaps.ma/",
  },
  {
    id: 21,
    name: "Deloitte",
    logo: "/partners/deloitte.png",
    website: "https://www2.deloitte.com/ma/fr.html",
  },
  {
    id: 22,
    name: "IDEMIA",
    logo: "/partners/idemia.png",
    website: "https://www.idemia.com/",
  },
  {
    id: 23,
    name: "CFG Bank",
    logo: "/partners/cfgbank.png",
    website: "https://www.cfgbank.com/",
  },
  {
    id: 24,
    name: "LabelVie",
    logo: "/partners/labelvie.png",
    website: "https://www.labelvie.ma/",
  },
  {
    id: 25,
    name: "VISEO",
    logo: "/partners/viseo.png",
    website: "https://www.viseo.com/",
  },
  {
    id: 26,
    name: "Rekrute",
    logo: "/partners/rekrute.png",
    website: "https://www.rekrute.com/",
  },
  {
    id: 27,
    name: "Intelcia",
    logo: "/partners/intelcia.png",
    website: "https://www.intelcia.com/",
  },
  {
    id: 28,
    name: "PortNet",
    logo: "/partners/portnet.png",
    website: "https://www.portnet.ma/",
  },
  {
    id: 29,
    name: "Sanlam",
    logo: "/partners/sanlam.png",
    website: "https://www.sanlam.ma/",
  },
  {
    id: 30,
    name: "CIH Bank",
    logo: "/partners/cihbank.png",
    website: "https://www.cihbank.ma/",
  },
  {
    id: 31,
    name: "AXA",
    logo: "/partners/axa.png",
    website: "https://www.axa.ma/",
  },
  {
    id: 32,
    name: "Sofrecom",
    logo: "/partners/sofrecom.png",
    website: "https://www.sofrecom.com/en/",
  },
  {
    id: 33,
    name: "Netopia",
    logo: "/partners/netopia.png",
    website: "https://www.netopia.com/",
  },
  {
    id: 34,
    name: "AFD Tech",
    logo: "/partners/afdtech.png",
    website: "https://www.afdtech.com/",
  },
  {
    id: 35,
    name: "Al Barid Bank",
    logo: "/partners/albaridbank.png",
    website: "https://www.albaridbank.ma/",
  },
  {
    id: 36,
    name: "Wafa Assurance",
    logo: "/partners/wafaassurance.png",
    website: "https://www.wafaassurance.ma/",
  },
  {
    id: 37,
    name: "Managem",
    logo: "/partners/managem.png",
    website: "https://www.managemgroup.com/",
  },
  {
    id: 38,
    name: "ADRIA",
    logo: "/partners/adria.png",
    website: "https://www.adria.ma/",
  },
  {
    id: 39,
    name: "HPS",
    logo: "/partners/hps.png",
    website: "https://www.hps-worldwide.com/",
  },
  {
    id: 40,
    name: "MAP",
    logo: "/partners/map.png",
    website: "https://www.mapnews.ma/",
  },
  {
    id: 41,
    name: "Cegedim",
    logo: "/partners/cegedim.png",
    website: "https://www.cegedim.com/",
  },
  {
    id: 42,
    name: "NBS Consulting",
    logo: "/partners/nbsconsulting.png",
    website: "https://www.nbs-consulting.com/",
  },
  {
    id: 43,
    name: "MAScIR",
    logo: "/partners/mascir.png",
    website: "https://www.mascir.com/",
  },
  {
    id: 44,
    name: "Formind",
    logo: "/partners/formind.png",
    website: "https://www.formind.fr/",
  },
  {
    id: 45,
    name: "DACHSER",
    logo: "/partners/dachser.png",
    website: "https://www.dachser.ma/",
  },
  {
    id: 46,
    name: "Fondation Arrawaj",
    logo: "/partners/arrawaj.png",
    website: "https://www.fondationarrawaj.ma/",
  },
  {
    id: 47,
    name: "Cercle RH",
    logo: "/partners/cerclerh.png",
    website: "https://www.cerclerh.ma/",
  },
  {
    id: 48,
    name: "ScreenDy",
    logo: "/partners/screendy.png",
    website: "https://www.screendy.com/",
  },
  {
    id: 49,
    name: "ESSEC Business School",
    logo: "/partners/essec.png",
    website: "https://www.essec.edu/",
  },
  {
    id: 50,
    name: "KEDGE Business School",
    logo: "/partners/kedge.png",
    website: "https://kedge.edu/",
  },
  {
    id: 51,
    name: "Université Laval",
    logo: "/partners/ulaval.png",
    website: "https://www.ulaval.ca/",
  },
  {
    id: 52,
    name: "NextXP",
    logo: "/partners/nextxp.png",
    website: "https://www.nextxp.io/",
  },
  {
    id: 53,
    name: "OKADIA",
    logo: "/partners/okadia.png",
    website: "https://www.okadia.com/",
  },
  {
    id: 54,
    name: "CMGP",
    logo: "/partners/cmgp.png",
    website: "https://www.cmgp.ma/",
  },
  {
    id: 55,
    name: "Novancy One",
    logo: "/partners/novancyone.png",
    website: "https://www.novancy.com/",
  },
  {
    id: 56,
    name: "Zodiac Aerospace",
    logo: "/partners/zodiac.png",
    website: "https://www.zodiacaerospace.com/",
  },
  {
    id: 57,
    name: "CDG Capital",
    logo: "/partners/cdgcapital.png",
    website: "https://www.cdgcapital.ma/",
  },
  {
    id: 58,
    name: "Accolade Center",
    logo: "/partners/accoladecenter.png",
    website: "https://www.accoladecenter.com/",
  },
  {
    id: 59,
    name: "ANRT",
    logo: "/partners/anrt.png",
    website: "https://www.anrt.ma/",
  },
  {
    id: 60,
    name: "Haut-Commissariat au Plan",
    logo: "/partners/hcp.png",
    website: "https://www.hcp.ma/",
  },
  {
    id: 61,
    name: "DDM",
    logo: "/partners/ddm.png",
    website: "#",
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
    <section className="py-16 md:py-24 bg-neutral-50 relative">
      <div className="container mx-auto px-4 sm:px-6">
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

        {/* Partners Grid - Professional and clean */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6"
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
                <div className="relative bg-white border border-neutral-200/60 rounded-lg p-6 md:p-8 h-32 md:h-36 flex items-center justify-center transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5 hover:-translate-y-0.5">
                  {/* Logo - More prominent */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="max-h-16 md:max-h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Subtle tooltip on hover */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg">
                      {partner.name}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA - More subtle */}
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
  );
};

export default PartnersSimple;
