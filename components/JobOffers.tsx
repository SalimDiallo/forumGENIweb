'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Euro, 
  Building, 
  Filter,
  Bookmark,
  BookmarkCheck,
  Star,
  TrendingUp,
  Users,
  Award,
  Search,
  ChevronRight,
  Share2
} from 'lucide-react';

// Types
type JobType = "cdi" | 'cdd' | 'stage' | 'freelance';
type FilterType = JobType | 'all';

interface Filter {
  id: FilterType;
  name: string;
  count: number;
  icon: React.ComponentType<any>;
}

interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salary: string;
  postedDate: string;
  description: string;
  requirements: string[];
  logo: string;
  featured: boolean;
  urgent: boolean;
  remote: boolean;
  rating: number;
  applicants: number;
}

const JobOffers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filters: Filter[] = [
    { id: 'all', name: 'Toutes', count: 24, icon: Building },
    { id: 'stage', name: 'Stages', count: 8, icon: Users },
    { id: 'cdi', name: 'CDI', count: 12, icon: Award },
    { id: 'cdd', name: 'CDD', count: 3, icon: Clock },
    { id: 'freelance', name: 'Freelance', count: 1, icon: TrendingUp }
  ];

  const jobOffers: JobOffer[] = [
    {
      id: 1,
      title: "Data Scientist Senior",
      company: "Groupe OCP",
      location: "Casablanca",
      type: "cdi",
      salary: "Compétitif",
      postedDate: "2025-01-05",
      description: "Innovation data-driven dans l'industrie des phosphates.",
      requirements: ["Master Data Science", "Python, R, SQL", "3+ ans"],
      logo: "/partners/ocp-logo.png",
      featured: true,
      urgent: false,
      remote: false,
      rating: 4.8,
      applicants: 45
    },
    {
      id: 2,
      title: "Consultant Digital",
      company: "Attijariwafa Bank",
      location: "Rabat",
      type: "cdi",
      salary: "À négocier",
      postedDate: "2025-01-03",
      description: "Transformation digitale et stratégies innovantes.",
      requirements: ["École ingénieur", "Consulting", "Anglais"],
      logo: "/partners/attijariwafa-logo.png",
      featured: false,
      urgent: true,
      remote: true,
      rating: 4.6,
      applicants: 32
    },
    {
      id: 3,
      title: "Stage Chef de Projet",
      company: "Maroc Telecom",
      location: "Casablanca",
      type: "stage",
      salary: "4000 DH/mois",
      postedDate: "2025-01-02",
      description: "Déploiement solutions télécoms innovantes.",
      requirements: ["Télécoms/Info", "Équipe", "Dynamisme"],
      logo: "/partners/maroc-telecom-logo.png",
      featured: false,
      urgent: false,
      remote: false,
      rating: 4.4,
      applicants: 78
    },
    {
      id: 4,
      title: "Développeur Full Stack",
      company: "StartUp Tech",
      location: "Remote",
      type: "freelance",
      salary: "350 DH/jour",
      postedDate: "2024-12-28",
      description: "Applications web modernes pour startup en croissance.",
      requirements: ["React, Node.js", "MongoDB", "Portfolio"],
      logo: "/partners/startup-logo.png",
      featured: true,
      urgent: false,
      remote: true,
      rating: 4.7,
      applicants: 23
    },
    {
      id: 5,
      title: "Analyste Financier",
      company: "BMCE Bank",
      location: "Casablanca",
      type: "cdd",
      salary: "15-18k DH",
      postedDate: "2024-12-25",
      description: "Analyse marchés financiers et support trading.",
      requirements: ["Master Finance", "Excel", "CFA+"],
      logo: "/partners/bmce-logo.png",
      featured: false,
      urgent: false,
      remote: false,
      rating: 4.5,
      applicants: 56
    }
  ];

  const filteredJobs = jobOffers.filter(job => {
    const matchesFilter = selectedFilter === 'all' || job.type === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleSaveJob = (jobId: number): void => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const getTypeLabel = (type: JobType): string => {
    const types: Record<JobType, string> = {
      'cdi': 'CDI',
      'cdd': 'CDD', 
      'stage': 'Stage',
      'freelance': 'Freelance'
    };
    return types[type];
  };

  const getTypeColor = (type: JobType): string => {
    const colors: Record<JobType, string> = {
      'cdi': 'bg-emerald-50 text-emerald-600 border-emerald-200',
      'cdd': 'bg-blue-50 text-blue-600 border-blue-200',
      'stage': 'bg-purple-50 text-purple-600 border-purple-200',
      'freelance': 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[type];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1j';
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <section className="relative py-12 sm:py-20 bg-white text-gray-900 overflow-hidden">
      {/* Background Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-3 hidden sm:block">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern - Lighter on mobile */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.2"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20 sm:opacity-40'></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header - Optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Offres d'Emploi
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Opportunités exclusives de nos partenaires
          </p>
        </motion.div>

        {/* Search Bar - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 shadow-sm text-sm sm:text-base"
            />
          </div>
        </motion.div>

        {/* Filters - Mobile scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-16"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 sm:gap-3 border-2 whitespace-nowrap text-sm sm:text-base ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-transparent shadow-lg shadow-emerald-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{filter.name}</span>
                  <span className="sm:hidden">{filter.name.slice(0, 3)}</span>
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                    selectedFilter === filter.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Job List - Mobile optimized */}
        <div className="space-y-4 sm:space-y-8 mb-12 sm:mb-16">
          <AnimatePresence mode="wait">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group ${
                  job.featured ? 'ring-2 ring-emerald-200 border-emerald-200' : ''
                }`}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                {/* Badges - Mobile positioned */}
                {job.featured && (
                  <div className="absolute -top-2 left-4 sm:-top-3 sm:left-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shadow-lg">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Offre vedette</span>
                      <span className="sm:hidden">Vedette</span>
                    </div>
                  </div>
                )}

                {job.urgent && (
                  <div className="absolute -top-2 right-4 sm:-top-3 sm:right-8">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium animate-pulse shadow-lg">
                      Urgent
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="flex items-start gap-3 sm:gap-6 flex-1">
                    {/* Company Logo - Smaller on mobile */}
                    <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-gray-100">
                      <Building className="w-6 h-6 sm:w-10 sm:h-10 text-emerald-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Title and Type - Mobile stacked */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border-2 ${getTypeColor(job.type)}`}>
                            {getTypeLabel(job.type)}
                          </span>
                          {job.remote && (
                            <span className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-full text-xs sm:text-sm font-medium">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Company Info - Mobile grid */}
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-6 text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="font-medium truncate">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Euro className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="font-medium truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{formatDate(job.postedDate)}</span>
                        </div>
                      </div>

                      {/* Rating and Applicants - Mobile simplified */}
                      <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < Math.floor(job.rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 text-xs sm:text-sm">{job.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-gray-600 text-xs sm:text-sm">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{job.applicants}</span>
                        </div>
                      </div>
                      
                      {/* Description - Hidden on small mobile */}
                      <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base hidden sm:block">
                        {job.description}
                      </p>
                      
                      {/* Requirements - Mobile simplified */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {job.requirements.slice(0, 3).map((req, reqIndex) => (
                          <span
                            key={reqIndex}
                            className="px-2 sm:px-3 py-1 bg-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-gray-200"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-500 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-gray-200">
                            +{job.requirements.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Mobile full width */}
                  <div className="flex flex-col gap-2 sm:gap-3 sm:items-end">
                    <motion.button 
                      className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="sm:hidden">Postuler</span>
                      <span className="hidden sm:inline">Postuler maintenant</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    
                    <div className="flex gap-2 sm:gap-3 justify-center sm:justify-end">
                      <motion.button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                          savedJobs.has(job.id)
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </motion.button>
                      
                      <motion.button
                        className="p-2 sm:p-3 bg-white text-gray-600 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Essayez d'autres critères</p>
            <motion.button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Réinitialiser
            </motion.button>
          </motion.div>
        )}

        {/* CTA Section - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border-2 border-gray-200">
            <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Pas d'offre idéale ?
              </span>
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg">
              Créez votre profil pour des notifications personnalisées
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Créer mon profil
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Alertes emploi
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated Wave Effect - Hidden on mobile for performance */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-60 hidden sm:block">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
          animate={{ 
            background: [
              'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
              'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)',
              'linear-gradient(90deg, #8b5cf6, #10b981, #3b82f6)',
              'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
};

export default JobOffers;