'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Euro,
  Building,
  Star,
  TrendingUp,
  Users,
  Award,
  Search,
  ChevronRight
} from 'lucide-react';
import { getPublicJobs } from '@/app/(sections)/careers/jobs.actions';
import ShareButton from './ui/ShareButton';

// Hook de debounce personnalisé
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

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
  slug: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description?: string;
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Debounce la recherche pour éviter trop de requêtes
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const getJobsAction = useAction(getPublicJobs);

  // Charger les jobs avec le terme de recherche debouncé
  const loadJobs = useCallback(() => {
    setLoading(true);
    getJobsAction.execute({
      search: debouncedSearchTerm || undefined,
      jobType: '',
      limit: 50,
      offset: 0,
    });
  }, [debouncedSearchTerm]);

  // Charger les jobs quand le terme de recherche debouncé change
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Handle action result
  useEffect(() => {
    if (getJobsAction.status === "hasSucceeded" && getJobsAction.result?.data?.jobs) {
      const mappedJobs: JobOffer[] = getJobsAction.result.data.jobs.map((job: any): JobOffer => ({
        ...job,
        slug: job.slug || `${job.id}-${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
      }));
      setJobs(mappedJobs);
      updateFilterCounts(mappedJobs);
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

  // Filtrage côté client: si "all" on prend tout, sinon on filtre par type
  const filteredJobs = React.useMemo(() => {
    let result = jobs;
    if (selectedFilter !== 'all') {
      result = result.filter(job => job.type === selectedFilter);
    }
    // Si besoin, tu peux aussi filtrer par search ici (mais conservons search côté backend)
    return result;
  }, [jobs, selectedFilter]);

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
        <div className="absolute top-10 left-6 w-64 h-64 bg-emerald-800  blur-2xl"></div>
        <div className="absolute bottom-10 right-6 w-[320px] h-[320px] bg-emerald-400  blur-2xl"></div>
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
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200  sm: text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 shadow-sm text-sm sm:text-base"
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
                  className={`px-3 sm:px-4 py-1.5 sm:py-2  sm: font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 border-2 whitespace-nowrap text-xs sm:text-sm ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-transparent shadow'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{filter.name}</span>
                  <span className="sm:hidden">{filter.name.slice(0, 3)}</span>
                  <span className={`text-xs px-1 sm:px-1.5 py-0.5  ${
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
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100  flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-emerald-600 border-t-transparent  animate-spin"></div>
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
              className={`relative bg-white  sm:rounded-2xl p-4 sm:p-6 transition-all duration-200 group ${
                job.featured
                  ? 'border-2 border-emerald-300/50 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:border-emerald-400'
                  : 'border border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-300'
              }`}
            >
              {/* Badges - Repositionnés en haut */}
              <div className="flex gap-2 mb-3">
                {job.featured && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white  text-xs font-semibold shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Offre vedette</span>
                    <span className="sm:hidden">Vedette</span>
                  </div>
                )}

                {job.urgent && (
                  <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white  text-xs font-semibold shadow-sm">
                    <span>⚡ Urgent</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  {/* Company Logo */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16  bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center flex-shrink-0 border-2 border-emerald-100/50 shadow-sm">
                    <Building className="w-6 h-6 sm:w-9 sm:h-9 text-emerald-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title and Type */}
                    <div className="flex flex-col gap-2 mb-3">
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-3 py-1  text-xs font-semibold border ${getTypeColor(job.type)}`}>
                          {getTypeLabel(job.type)}
                        </span>
                        {job.remote && (
                          <span className="inline-flex items-center px-3 py-1  bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            🌍 Remote
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-gray-600 mb-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-50">
                          <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                        </div>
                        <span className="font-semibold text-gray-800 truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-50">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                        </div>
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-50">
                          <Euro className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                        </div>
                        <span className="font-semibold text-emerald-700 truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-50">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                        </div>
                        <span className="text-gray-500">{formatDate(job.postedDate)}</span>
                      </div>
                    </div>

                    {/* Requirements tags */}
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs font-semibold rounded-lg border border-gray-300">
                          +{job.requirements.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:items-end mt-3 sm:mt-0 sm:min-w-[180px]">
                  <Link
                    href={`/careers/${job.slug}`}
                    className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 text-white  font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>Voir les détails</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>

                  <ShareButton
                    title={job.title}
                    description={`Offre d'emploi ${job.type} chez ${job.company}`}
                    size="md"
                  />
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-8 sm:py-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100  flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-4 sm:mb-5 text-xs sm:text-sm">Essayez d'autres critères</p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg sm: font-medium hover:shadow transition-all duration-300 text-xs sm:text-sm"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* CTA Section - Mobile optimized */}
      
      </div>

      {/* Animated Wave Effect - Hidden on mobile for performance */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-500 opacity-60 hidden sm:block" />
    </section>
  );
};

export default JobOffers;
