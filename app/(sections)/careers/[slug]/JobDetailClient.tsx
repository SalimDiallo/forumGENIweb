'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Banknote,
  Building2,
  Briefcase,
  Star,
  Award,
  ChevronLeft,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  GraduationCap,
  TrendingUp,
  Globe,
  Wifi,
  ArrowRight,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShareButton from '@/components/ui/ShareButton';

interface JobDetailProps {
  job: {
    id: number;
    title: string;
    slug: string;
    company: string;
    companyLogo?: string | null;
    companyWebsite?: string | null;
    industry?: string | null;
    location: string;
    type: string;
    isRemote: boolean;
    salary: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string | null;
    salaryPeriod?: string | null;
    postedDate: string;
    description: string;
    requirements: string[];
    benefits: string[];
    skillsRequired: string[];
    languagesRequired: string[];
    experienceRequired?: string | null;
    educationLevel?: string | null;
    contractDuration?: string | null;
    startDate?: string | null;
    applicationEmail?: string | null;
    applicationUrl?: string | null;
    applicationPhone?: string | null;
    applicationDeadline?: string | null;
    featured: boolean;
    viewsCount: number;
  };
}

const JobDetailClient: React.FC<JobDetailProps> = ({ job }) => {
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
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isDeadlineSoon = (deadline?: string | null): boolean => {
    if (!deadline) return false;
    const diff = new Date(deadline).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  const hasApplicationMethod = job.applicationEmail || job.applicationPhone || job.applicationUrl;

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Breadcrumb / Nav Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex items-center justify-between py-3">
            <Link
              href="/careers"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Toutes les offres
            </Link>
            <ShareButton
              title={`${job.title} - ${job.company}`}
              description={job.description.substring(0, 150)}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
              {/* Featured Badge */}
              {job.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200 mb-4">
                  <Star className="w-3 h-3" />
                  Offre vedette
                </div>
              )}

              <div className="flex gap-4 mb-5">
                {/* Company Logo */}
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                  {job.companyLogo && job.companyLogo !== '/partners/default-logo.png' ? (
                    <Image
                      src={job.companyLogo}
                      alt={job.company}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <Building2 className="w-7 h-7 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-1">
                    {job.title}
                  </h1>
                  <p className="text-base text-gray-600 font-medium">{job.company}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border ${getTypeColor(job.type)}`}>
                  {getTypeLabel(job.type)}
                </span>
                {job.isRemote && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    <Wifi className="w-3.5 h-3.5" />
                    Télétravail
                  </span>
                )}
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Localisation</p>
                    <p className="text-sm font-semibold text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <Banknote className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Rémunération</p>
                    <p className="text-sm font-semibold text-gray-900">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Publiée le</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(job.postedDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                </div>
                Description du poste
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-800 prose-li:marker:text-emerald-500">
                <MarkdownRenderer content={job.description} />
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  Exigences
                </h2>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skillsRequired.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  Compétences requises
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-150 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-violet-600" />
                  </div>
                  Avantages
                </h2>
                <ul className="space-y-2.5">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Application Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-16">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Postuler</h3>

              {/* Deadline */}
              {job.applicationDeadline && (
                <div className={`rounded-lg p-3 mb-4 text-sm ${
                  isDeadlineSoon(job.applicationDeadline)
                    ? 'bg-red-50 border border-red-100'
                    : 'bg-gray-50 border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 flex-shrink-0 ${
                      isDeadlineSoon(job.applicationDeadline) ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        isDeadlineSoon(job.applicationDeadline) ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        Date limite
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        isDeadlineSoon(job.applicationDeadline) ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatDate(job.applicationDeadline)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Application Methods */}
              <div className="space-y-2.5">
                {job.applicationUrl && (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Postuler en ligne
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                {job.applicationEmail && (
                  <a
                    href={`mailto:${job.applicationEmail}`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs text-gray-500">Par email</p>
                      <p className="font-medium truncate text-gray-800">{job.applicationEmail}</p>
                    </div>
                  </a>
                )}

                {job.applicationPhone && (
                  <a
                    href={`tel:${job.applicationPhone}`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs text-gray-500">Par téléphone</p>
                      <p className="font-medium text-gray-800">{job.applicationPhone}</p>
                    </div>
                  </a>
                )}

                {!hasApplicationMethod && (
                  <p className="text-sm text-gray-500 italic text-center py-4">
                    Aucune information de contact disponible
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                {job.experienceRequired && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Expérience</p>
                      <p className="text-sm font-semibold text-gray-900">{job.experienceRequired}</p>
                    </div>
                  </div>
                )}

                {job.educationLevel && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Formation</p>
                      <p className="text-sm font-semibold text-gray-900">{job.educationLevel}</p>
                    </div>
                  </div>
                )}

                {job.contractDuration && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Durée du contrat</p>
                      <p className="text-sm font-semibold text-gray-900">{job.contractDuration}</p>
                    </div>
                  </div>
                )}

                {job.startDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date de début</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(job.startDate)}</p>
                    </div>
                  </div>
                )}

                {job.languagesRequired.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1.5">Langues</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.languagesRequired.map((lang, index) => (
                          <span key={index} className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-150 font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {job.industry && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Secteur d&apos;activité</p>
                      <p className="text-sm font-semibold text-gray-900">{job.industry}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Website */}
              {job.companyWebsite && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Site web de l&apos;entreprise
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailClient;
