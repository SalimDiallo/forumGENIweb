'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Euro, Building, ExternalLink, Filter } from 'lucide-react';

const JobOffers = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'Toutes' },
    { id: 'stage', name: 'Stages' },
    { id: 'cdi', name: 'CDI' },
    { id: 'cdd', name: 'CDD' },
    { id: 'freelance', name: 'Freelance' }
  ];

  const jobOffers = [
    {
      id: 1,
      title: "Data Scientist Senior",
      company: "Groupe OCP",
      location: "Casablanca",
      type: "cdi",
      salary: "Compétitif",
      postedDate: "2025-01-05",
      description: "Rejoignez notre équipe innovation pour développer des solutions data-driven révolutionnaires dans l'industrie des phosphates.",
      requirements: ["Master en Data Science", "Python, R, SQL", "3+ ans d'expérience"],
      logo: "/partners/ocp-logo.png"
    },
    {
      id: 2,
      title: "Consultant en Transformation Digitale",
      company: "Attijariwafa Bank",
      location: "Rabat",
      type: "cdi",
      salary: "À négocier",
      postedDate: "2025-01-03",
      description: "Accompagnez nos clients dans leur transformation digitale et développez des stratégies innovantes.",
      requirements: ["École d'ingénieur", "Expérience consulting", "Anglais courant"],
      logo: "/partners/attijariwafa-logo.png"
    },
    {
      id: 3,
      title: "Stage - Assistant Chef de Projet",
      company: "Maroc Telecom",
      location: "Casablanca",
      type: "stage",
      salary: "4000 DH/mois",
      postedDate: "2025-01-02",
      description: "Participez au déploiement de nouvelles solutions télécoms et découvrez l'innovation technologique.",
      requirements: ["Étudiant en télécoms/informatique", "Esprit d'équipe", "Dynamisme"],
      logo: "/partners/maroc-telecom-logo.png"
    },
    {
      id: 4,
      title: "Développeur Full Stack",
      company: "StartUp Tech",
      location: "Remote",
      type: "freelance",
      salary: "350 DH/jour",
      postedDate: "2024-12-28",
      description: "Développez des applications web modernes pour une startup en forte croissance.",
      requirements: ["React, Node.js", "MongoDB", "Portfolio requis"],
      logo: "/partners/startup-logo.png"
    },
    {
      id: 5,
      title: "Analyste Financier",
      company: "BMCE Bank",
      location: "Casablanca",
      type: "cdd",
      salary: "15000-18000 DH",
      postedDate: "2024-12-25",
      description: "Analyse des marchés financiers et support aux équipes de trading pour optimiser les investissements.",
      requirements: ["Master Finance", "Excel avancé", "CFA apprécié"],
      logo: "/partners/bmce-logo.png"
    }
  ];

  const filteredJobs = selectedFilter === 'all' 
    ? jobOffers 
    : jobOffers.filter(job => job.type === selectedFilter);

  const getTypeLabel = (type: string) => {
    const types = {
      'cdi': 'CDI',
      'cdd': 'CDD', 
      'stage': 'Stage',
      'freelance': 'Freelance'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'cdi': 'bg-green-100 text-green-800',
      'cdd': 'bg-blue-100 text-blue-800',
      'stage': 'bg-purple-100 text-purple-800',
      'freelance': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            Offres d'Emploi
          </h2>
          <p className="text-lg text-green-700/80 max-w-2xl mx-auto">
            Découvrez les opportunités exclusives proposées par nos partenaires
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-green-800 text-white'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </motion.div>

        {/* Liste des offres */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="text-green-600" size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-green-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                        {getTypeLabel(job.type)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-green-700 mb-3">
                      <div className="flex items-center gap-1">
                        <Building size={16} />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro size={16} />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {new Date(job.postedDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    <p className="text-green-700/80 mb-3">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 lg:items-end">
                  <button className="px-6 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                    Postuler
                    <ExternalLink size={16} />
                  </button>
                  <button className="px-6 py-2 border border-green-200 text-green-800 rounded-lg font-medium hover:bg-green-50 transition-colors">
                    Sauvegarder
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-green-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Vous ne trouvez pas l'offre idéale ?
            </h3>
            <p className="text-green-700/80 mb-6">
              Créez votre profil et recevez des notifications pour les nouvelles opportunités
            </p>
            <button className="px-8 py-3 bg-green-800 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Créer mon profil
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobOffers;
