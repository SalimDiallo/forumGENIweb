'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Users,
  FileText,
  ExternalLink,
  ArrowRight,
  Download,
  Video,
  Headphones,
} from 'lucide-react';

const CareerAdvice = () => {
  const careerTips = [
    {
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
      title: "Développer ses compétences techniques",
      description: "Les compétences les plus recherchées en 2025",
      tips: [
        "Intelligence Artificielle et Machine Learning",
        "Cybersécurité et protection des données",
        "Développement web et mobile",
        "Analyse de données et Business Intelligence"
      ]
    },
    {
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      title: "Construire son réseau professionnel",
      description: "Stratégies efficaces pour développer votre réseau",
      tips: [
        "Participer aux événements de networking",
        "Être actif sur LinkedIn",
        "Rejoindre des associations professionnelles",
        "Mentoring et reverse mentoring"
      ]
    },
    {
      icon: FileText,
      color: 'bg-amber-50 text-amber-600',
      title: "Optimiser son CV et profil",
      description: "Les meilleures pratiques pour se démarquer",
      tips: [
        "CV adapté à chaque poste",
        "Portfolio en ligne à jour",
        "Recommandations LinkedIn",
        "Présence professionnelle digitale"
      ]
    },
    {
      icon: BookOpen,
      color: 'bg-violet-50 text-violet-600',
      title: "Formation continue",
      description: "Rester compétitif dans un marché en évolution",
      tips: [
        "Certifications professionnelles",
        "MOOCs et formations en ligne",
        "Conférences et webinaires",
        "Veille technologique régulière"
      ]
    }
  ];

  const resources = [
    {
      title: "Guide CV 2025",
      description: "Modèles et conseils pour un CV qui se démarque",
      link: "/resources/cv-guide.pdf",
      type: "PDF",
      icon: Download,
    },
    {
      title: "Préparer son entretien",
      description: "Questions fréquentes et techniques de réponse",
      link: "/resources/interview-prep",
      type: "Article",
      icon: FileText,
    },
    {
      title: "Négocier son salaire",
      description: "Stratégies pour négocier efficacement",
      link: "/resources/salary-negotiation",
      type: "Vidéo",
      icon: Video,
    },
    {
      title: "Personal Branding",
      description: "Construire sa marque personnelle professionnelle",
      link: "/resources/personal-branding",
      type: "Webinar",
      icon: Headphones,
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Conseils carrière
          </h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Guides pratiques et conseils d&apos;experts pour booster votre développement professionnel
          </p>
        </motion.div>

        {/* Career Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {careerTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {tip.description}
                    </p>
                    <ul className="space-y-2">
                      {tip.tips.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">
            Ressources gratuites
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => {
              const ResIcon = resource.icon;
              return (
                <Link
                  key={index}
                  href={resource.link}
                  className="group bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100 group-hover:border-gray-200 transition-colors">
                      <ResIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="px-2 py-0.5 bg-white text-gray-500 text-xs font-medium rounded-full border border-gray-150">
                      {resource.type}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                    {resource.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {resource.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerAdvice;
