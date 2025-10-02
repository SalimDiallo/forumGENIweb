'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Users, FileText, ExternalLink } from 'lucide-react';

const CareerAdvice = () => {
  const careerTips = [
    {
      icon: <TrendingUp className="text-black" size={32} />,
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
      icon: <Users className="text-black" size={32} />,
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
      icon: <FileText className="text-black" size={32} />,
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
      icon: <BookOpen className="text-black" size={32} />,
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
      type: "PDF"
    },
    {
      title: "Préparer son entretien",
      description: "Questions fréquentes et techniques de réponse",
      link: "/resources/interview-prep",
      type: "Article"
    },
    {
      title: "Négocier son salaire",
      description: "Stratégies pour négocier efficacement",
      link: "/resources/salary-negotiation",
      type: "Vidéo"
    },
    {
      title: "Personal Branding",
      description: "Construire sa marque personnelle professionnelle",
      link: "/resources/personal-branding",
      type: "Webinar"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
            Conseils Carrière
          </h2>
          <p className="text-lg text-black/80 max-w-2xl mx-auto">
            Guides pratiques et conseils d'experts pour booster votre développement professionnel
          </p>
        </motion.div>

        {/* Conseils principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {careerTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-black/80 mb-4">
                    {tip.description}
                  </p>
                  <ul className="space-y-2">
                    {tip.tips.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-black">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ressources téléchargeables */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 border border-emerald-100"
        >
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
            Ressources Gratuites
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border border-emerald-200 rounded-lg p-4 hover:border-emerald-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-emerald-900">{resource.title}</h4>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded">
                    {resource.type}
                  </span>
                </div>
                <p className="text-black/80 text-sm mb-4">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-1 text-emerald-800 font-medium hover:text-black transition-colors"
                >
                  Télécharger
                  <ExternalLink size={14} />
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Coaching */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-emerald-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un accompagnement personnalisé ?
            </h3>
            <p className="text-emerald-200 mb-6">
              Nos experts sont disponibles pour vous conseiller dans votre développement de carrière
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-emerald-800 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                Réserver un coaching
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerAdvice;
