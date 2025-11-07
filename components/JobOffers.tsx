'use client';

import React, { useState, useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
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
  Share2,
  Plus,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { getPublicJobs } from '@/app/(sections)/careers/jobs.actions';
import JobSubmissionModal from './JobSubmissionModal';

// Types
type JobType = "cdi" | 'cdd' | 'stage' | 'freelance' | 'alternance' | 'autre';
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
  type: string; // Changed from JobType to string to match backend
  salary: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  skills?: string[];
  logo: string;
  featured: boolean;
  urgent: boolean;
  remote: boolean;
  rating: number;
  applicants: number;
  applicationEmail?: string | null;
  applicationUrl?: string | null;
  applicationPhone?: string | null;
  applicationDeadline?: string | null;
}

const JobOffers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const getJobsAction = useAction(getPublicJobs);

  // Load jobs from backend
  useEffect(() => {
    loadJobs();
  }, [selectedFilter, searchTerm]);

  const loadJobs = () => {
    setLoading(true);
    getJobsAction.execute({
      search: searchTerm || undefined,
      jobType: selectedFilter === 'all' ? undefined : selectedFilter,
      limit: 50,
      offset: 0,
    });
  };

  // Handle action result
  useEffect(() => {
    if (getJobsAction.status === "hasSucceeded" && getJobsAction.result?.data?.jobs) {
      setJobs(getJobsAction.result.data.jobs);
      updateFilterCounts(getJobsAction.result.data.jobs);
      setLoading(false);
    } else if (getJobsAction.status === "hasErrored") {
      console.error('Erreur lors du chargement des offres:', getJobsAction.result?.serverError);
      setLoading(false);
    }
  }, [getJobsAction.status, getJobsAction.result]);

  const updateFilterCounts = (jobsList: JobOffer[]) => {
    const counts: Record<string, number> = {
      all: jobsList.length,
      stage: 0,
      cdi: 0,
      cdd: 0,
      freelance: 0,
      alternance: 0,
      autre: 0,
    };

    jobsList.forEach(job => {
      if (job.type in counts) {
        counts[job.type]++;
      }
    });

    setFilterCounts(counts);
  };

  const filters: Filter[] = [
    { id: 'all', name: 'Toutes', count: filterCounts.all || 0, icon: Building },
    { id: 'stage', name: 'Stages', count: filterCounts.stage || 0, icon: Users },
    { id: 'cdi', name: 'CDI', count: filterCounts.cdi || 0, icon: Award },
    { id: 'cdd', name: 'CDD', count: filterCounts.cdd || 0, icon: Clock },
    { id: 'freelance', name: 'Freelance', count: filterCounts.freelance || 0, icon: TrendingUp }
  ];

  const filteredJobs = jobs; // Jobs are already filtered by the backend

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

  const getTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      'cdi': 'CDI',
      'cdd': 'CDD', 
      'stage': 'Stage',
      'freelance': 'Freelance',
      'alternance': 'Alternance',
      'autre': 'Autre'
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'cdi': 'bg-emerald-50 text-emerald-800 border-emerald-200',
      'cdd': 'bg-emerald-50 text-emerald-800 border-emerald-200',
      'stage': 'bg-blue-50 text-blue-800 border-blue-200',
      'freelance': 'bg-orange-50 text-orange-600 border-orange-200',
      'alternance': 'bg-purple-50 text-purple-800 border-purple-200',
      'autre': 'bg-gray-50 text-gray-800 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-800 border-gray-200';
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
    <section className="relative py-8 sm:py-12 bg-white text-gray-900 overflow-hidden">
      {/* Background Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-3 hidden sm:block">
        <div className="absolute top-10 left-6 w-64 h-64 bg-emerald-800 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-6 w-[320px] h-[320px] bg-emerald-400 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern - Lighter on mobile */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.2"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20 sm:opacity-40'></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header - Optimized for mobile */}
        <div className="text-center mb-5 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-800 to-emerald-800 bg-clip-text text-transparent">
              Offres d'Emploi
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Opportunités exclusives de nos partenaires
          </p>
          
          {/* Bouton de soumission d'offre */}
          <div className="mt-4">
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Proposer une offre d'emploi
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile optimized */}
        <div className="max-w-xl mx-auto mb-5 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Filters - Mobile scroll */}
        <div className="mb-5 sm:mb-10">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 border-2 whitespace-nowrap text-xs sm:text-sm ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-transparent shadow'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{filter.name}</span>
                  <span className="sm:hidden">{filter.name.slice(0, 3)}</span>
                  <span className={`text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                    selectedFilter === filter.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Chargement des offres...</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Veuillez patienter</p>
          </div>
        )}

        {/* Job List - Mobile optimized */}
        {!loading && (
          <div className="space-y-3 sm:space-y-5 mb-8 sm:mb-10">
            {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`relative bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 hover:border-gray-300 hover:shadow transition-all duration-300 group ${
                job.featured ? 'ring-2 ring-emerald-200 border-emerald-200' : ''
              }`}
            >
              {/* Badges - Mobile positioned */}
              {job.featured && (
                <div className="absolute -top-2 left-4 sm:-top-3 sm:left-8">
                  <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 shadow">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Offre vedette</span>
                    <span className="sm:hidden">Vedette</span>
                  </div>
                </div>
              )}

              {job.urgent && (
                <div className="absolute -top-2 right-4 sm:-top-3 sm:right-8">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow">
                    Urgent
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-4 flex-1">
                  {/* Company Logo - Smaller on mobile */}
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-gray-100">
                    <Building className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-800" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Title and Type - Mobile stacked */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-tight">
                        {job.title}
                      </h3>
                      <div className="flex gap-1 flex-wrap">
                        <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium border-2 ${getTypeColor(job.type)}`}>
                          {getTypeLabel(job.type)}
                        </span>
                        {job.remote && (
                          <span className="px-2 sm:px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border-2 border-emerald-200 rounded-full text-xs sm:text-sm font-medium">
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Company Info - Mobile grid */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-3 text-gray-600 mb-2 sm:mb-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Euro className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{formatDate(job.postedDate)}</span>
                      </div>
                    </div>

                    {/* Rating and Applicants - Mobile simplified */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-2">
                      <div className="flex items-center gap-1 sm:gap-1.5">
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
                      <div className="flex items-center gap-1 sm:gap-1.5 text-gray-600 text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{job.applicants}</span>
                      </div>
                    </div>
                    
                    {/* Description - Hidden on small mobile */}
                    <p className="text-gray-600 mb-2 sm:mb-2 leading-relaxed text-xs sm:text-sm hidden sm:block">
                      {job.description}
                    </p>
                    
                    {/* Requirements - Mobile simplified */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {job.requirements.slice(0, 3).map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="px-2 sm:px-2.5 py-0.5 bg-gray-50 text-gray-700 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-gray-200"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="px-2 sm:px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs sm:text-sm rounded-lg sm:rounded-xl border border-gray-200">
                          +{job.requirements.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Mobile full width */}
                <div className="flex flex-col gap-1 sm:gap-2 sm:items-end mt-2 sm:mt-0">
                  <button
                    onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-2 group text-xs sm:text-sm"
                  >
                    <span>{expandedJobId === job.id ? 'Masquer' : 'Voir'} les contacts</span>
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${expandedJobId === job.id ? 'rotate-90' : ''}`} />
                  </button>

                  <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end">
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                        savedJobs.has(job.id)
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {savedJobs.has(job.id) ? (
                        <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>

                    <button
                      className="p-2 sm:p-2.5 bg-white text-gray-600 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information - Expandable */}
              {expandedJobId === job.id && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    Informations de contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {job.applicationEmail && (
                      <a
                        href={`mailto:${job.applicationEmail}`}
                        className="flex items-center gap-2 p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-medium text-emerald-800 truncate">{job.applicationEmail}</p>
                        </div>
                      </a>
                    )}
                    {job.applicationPhone && (
                      <a
                        href={`tel:${job.applicationPhone}`}
                        className="flex items-center gap-2 p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Téléphone</p>
                          <p className="text-sm font-medium text-emerald-800">{job.applicationPhone}</p>
                        </div>
                      </a>
                    )}
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors sm:col-span-2"
                      >
                        <ExternalLink className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-600">Lien de candidature</p>
                          <p className="text-sm font-medium text-emerald-800 truncate">{job.applicationUrl}</p>
                        </div>
                      </a>
                    )}
                  </div>
                  {job.applicationDeadline && (
                    <p className="mt-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Date limite : {new Date(job.applicationDeadline).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {!job.applicationEmail && !job.applicationPhone && !job.applicationUrl && (
                    <p className="text-sm text-gray-500 italic">Aucune information de contact disponible</p>
                  )}
                </div>
              )}
            </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-8 sm:py-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-4 sm:mb-5 text-xs sm:text-sm">Essayez d'autres critères</p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg sm:rounded-xl font-medium hover:shadow transition-all duration-300 text-xs sm:text-sm"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* CTA Section - Mobile optimized */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-gray-200">
            <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-emerald-800 to-emerald-800 bg-clip-text text-transparent">
                Pas d'offre idéale ?
              </span>
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-5 text-xs sm:text-base">
              Créez votre profil pour des notifications personnalisées
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button 
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow hover:shadow-emerald-200 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-2 group text-xs sm:text-sm"
              >
                Créer mon profil
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-xs sm:text-sm"
              >
                Alertes emploi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Wave Effect - Hidden on mobile for performance */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-500 opacity-60 hidden sm:block" />
      
      {/* Job Submission Modal */}
      <JobSubmissionModal
        open={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSuccess={() => {
          // Recharger les offres après soumission
          loadJobs();
        }}
      />
    </section>
  );
};

export default JobOffers;