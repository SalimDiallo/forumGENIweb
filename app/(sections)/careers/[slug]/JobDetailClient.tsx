'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Euro,
  Building,
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
  Bookmark
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white pt-8">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux offres
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Job Header */}
            <div className="bg-white  p-4 border border-gray-200">
              {job.featured && (
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Offre vedette</span>
                </div>
              )}

              <div className="flex gap-3 mb-3">
                <div className="w-12 h-12  flex items-center justify-center border border-gray-200 bg-gray-50">
                  <Building className="w-7 h-7 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{job.title}</h1>
                  <p className="text-base text-gray-700">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1  text-sm text-gray-700 border border-gray-300 bg-gray-50">
                  {getTypeLabel(job.type)}
                </span>
                {job.isRemote && (
                  <span className="px-3 py-1  text-sm text-gray-700 border border-gray-300 bg-gray-50">
                    Remote
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-400" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Publié le {formatDate(job.postedDate)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white  p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400" />
                Description du poste
              </h2>
              <div className="prose prose-sm max-w-none text-gray-800">
                <MarkdownRenderer content={job.description} />
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="bg-white  p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-400" />
                  Exigences
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-200"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skillsRequired.length > 0 && (
              <div className="bg-white  p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  Compétences requises
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="bg-white  p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  Avantages
                </h2>
                <ul className="list-disc ml-6 space-y-1 text-gray-800 text-sm">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Application Card */}
            <div className="bg-white  p-4 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Postuler maintenant</h3>

              {job.applicationDeadline && (
                <div className="rounded border border-gray-200 p-2 mb-3 text-sm text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Date limite : {formatDate(job.applicationDeadline)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {job.applicationEmail && (
                  <a
                    href={`mailto:${job.applicationEmail}`}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 text-gray-800 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium truncate">{job.applicationEmail}</p>
                    </div>
                  </a>
                )}

                {job.applicationPhone && (
                  <a
                    href={`tel:${job.applicationPhone}`}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 text-gray-800 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="font-medium">{job.applicationPhone}</p>
                    </div>
                  </a>
                )}

                {job.applicationUrl && (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 bg-gray-50 text-gray-800 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Lien de candidature</p>
                      <p className="font-medium truncate">Postuler en ligne</p>
                    </div>
                  </a>
                )}

                {!job.applicationEmail && !job.applicationPhone && !job.applicationUrl && (
                  <p className="text-sm text-gray-500 italic text-center py-3">
                    Aucune information de contact disponible
                  </p>
                )}
              </div>

            </div>

            {/* Additional Info Card */}
            <div className="bg-white  p-4 border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Informations complémentaires</h3>
              <div className="space-y-3 text-sm">
                {job.experienceRequired && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      Expérience
                    </p>
                    <p className="font-medium text-gray-900 ml-6">{job.experienceRequired}</p>
                  </div>
                )}

                {job.educationLevel && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      Formation
                    </p>
                    <p className="font-medium text-gray-900 ml-6">{job.educationLevel}</p>
                  </div>
                )}

                {job.contractDuration && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Durée du contrat
                    </p>
                    <p className="font-medium text-gray-900 ml-6">{job.contractDuration}</p>
                  </div>
                )}

                {job.startDate && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Date de début
                    </p>
                    <p className="font-medium text-gray-900 ml-6">{formatDate(job.startDate)}</p>
                  </div>
                )}

                {job.languagesRequired.length > 0 && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-gray-400" />
                      Langues
                    </p>
                    <div className="flex flex-wrap gap-1 ml-6">
                      {job.languagesRequired.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded border border-gray-200">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.industry && (
                  <div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      Secteur
                    </p>
                    <p className="font-medium text-gray-900 ml-6">{job.industry}</p>
                  </div>
                )}
              </div>

              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full px-4 py-2 bg-gray-100 text-emerald-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 underline"
                  style={{ textUnderlineOffset: '3px' }}
                >
                  <Globe className="w-4 h-4 text-emerald-700" />
                  Site web de l'entreprise
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailClient;
