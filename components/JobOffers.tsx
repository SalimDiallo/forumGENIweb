'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Banknote,
  Building2,
  Users,
  Award,
  TrendingUp,
  Search,
  ChevronRight,
  Briefcase,
  Wifi,
  AlertCircle,
  Star,
  X,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { getPublicJobs } from '@/app/(sections)/careers/jobs.actions';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

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
  requirements: string[];
  logo: string;
  featured: boolean;
  urgent: boolean;
  remote: boolean;
}

const JobOffers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const getJobsAction = useAction(getPublicJobs);

  const loadJobs = useCallback(() => {
    setLoading(true);
    getJobsAction.execute({
      search: debouncedSearchTerm || undefined,
      jobType: '',
      limit: 50,
      offset: 0,
    });
  }, [debouncedSearchTerm]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

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
      if (job.type in counts) counts[job.type]++;
    });
    setFilterCounts(counts);
  };

  const filters: Filter[] = [
    { id: 'all', name: 'Toutes les offres', count: filterCounts.all || 0, icon: Briefcase },
    { id: 'stage', name: 'Stages', count: filterCounts.stage || 0, icon: Users },
    { id: 'cdi', name: 'CDI', count: filterCounts.cdi || 0, icon: Award },
    { id: 'cdd', name: 'CDD', count: filterCounts.cdd || 0, icon: Clock },
    { id: 'freelance', name: 'Freelance', count: filterCounts.freelance || 0, icon: TrendingUp },
    { id: 'alternance', name: 'Alternance', count: filterCounts.alternance || 0, icon: Building2 },
  ];

  const filteredJobs = React.useMemo(() => {
    let result = jobs;
    if (selectedFilter !== 'all') {
      result = result.filter(job => job.type === selectedFilter);
    }
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
      'cdi': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'cdd': 'bg-amber-50 text-amber-700 border-amber-200',
      'stage': 'bg-blue-50 text-blue-700 border-blue-200',
      'freelance': 'bg-violet-50 text-violet-700 border-violet-200',
      'alternance': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'autre': 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[type] || colors['autre'];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Section Header */}
        <header className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Offres disponibles
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Trouvez l&apos;opportunité qui correspond à votre profil parmi nos offres vérifiées
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              aria-label="Rechercher une offre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par poste, entreprise ou lieu…"
              className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-10 py-3.5 text-sm focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 placeholder-gray-400 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap items-center justify-center mb-8">
          {filters.map(filter => {
            const isActive = selectedFilter === filter.id;
            if (filter.count === 0 && filter.id !== 'all') return null;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>{filter.name}</span>
                <span className={`text-xs font-normal ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        {!loading && filteredJobs.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-100 rounded-lg w-3/5" />
                    <div className="h-4 bg-gray-100 rounded-lg w-2/5" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                      <div className="h-6 bg-gray-100 rounded-full w-24" />
                      <div className="h-6 bg-gray-100 rounded-full w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Search className="text-gray-400 w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune offre trouvée</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm">
              Essayez de modifier vos filtres ou votre recherche pour trouver des résultats
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSearchTerm('');
              }}
              className="px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Job List */}
        {!loading && filteredJobs.length > 0 && (
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <Link
                key={job.id}
                href={`/careers/${job.slug}`}
                className="group block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex gap-4 items-start">
                    {/* Company Logo */}
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      {job.logo && job.logo !== '/partners/default-logo.png' ? (
                        <Image
                          src={job.logo}
                          alt={job.company}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      ) : (
                        <Building2 className="text-gray-400 w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm text-gray-400 group-hover:text-emerald-600 transition-colors font-medium flex items-center gap-1">
                            Voir l&apos;offre
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Banknote className="w-3.5 h-3.5 text-gray-400" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(job.postedDate)}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getTypeColor(job.type)}`}>
                          {getTypeLabel(job.type)}
                        </span>
                        {job.remote && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                            <Wifi className="w-3 h-3" />
                            Remote
                          </span>
                        )}
                        {job.featured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Star className="w-3 h-3" />
                            Vedette
                          </span>
                        )}
                        {job.urgent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                        {/* Skills preview */}
                        {job.requirements && job.requirements.length > 0 && (
                          <>
                            <span className="hidden sm:inline text-gray-300">·</span>
                            {job.requirements.slice(0, 2).map((req, i) => (
                              <span key={i} className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 2 && (
                              <span className="hidden sm:inline text-xs text-gray-400">
                                +{job.requirements.length - 2}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobOffers;
