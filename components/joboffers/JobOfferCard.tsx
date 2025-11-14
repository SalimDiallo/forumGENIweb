'use client';

import {
  MapPin,
  Clock,
  Euro,
  Building,
  Bookmark,
  BookmarkCheck,
  Star,
  Users,
  Share2,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
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

interface JobOfferCardProps {
  job: JobOffer;
  savedJobs: Set<number>;
  toggleSaveJob: (jobId: number) => void;
  getTypeLabel: (type: string) => string;
  getTypeColor: (type: string) => string;
  formatDate: (dateString: string) => string;
}

export default function JobOfferCard({
  job,
  savedJobs,
  toggleSaveJob,
  getTypeLabel,
  getTypeColor,
  formatDate,
}: JobOfferCardProps) {
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  return (
    <div
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
  );
}
