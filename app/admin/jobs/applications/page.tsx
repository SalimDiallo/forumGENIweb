"use client";
import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { getJobApplications } from "@/app/(sections)/careers/application.actions";
import { listJobs } from "../actions";
import Link from "next/link";
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search,
  ArrowLeft,
  Briefcase
} from "lucide-react";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  resumeUrl: string | null;
  coverLetter: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  availability: string | null;
  expectedSalary: string | null;
  additionalInfo: string | null;
  status: string;
  appliedAt: Date;
  reviewedAt: Date | null;
  notes: string | null;
}

interface JobOffer {
  id: number;
  title: string;
  companyName: string;
}

export default function JobApplicationsPage() {
  const searchParams = useSearchParams();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);

  const getApplicationsAction = useAction(getJobApplications);
  const listJobsAction = useAction(listJobs);

  // Load jobs on component mount
  useEffect(() => {
    listJobsAction.execute();
  }, []);

  // Load applications when job is selected
  useEffect(() => {
    if (selectedJobId) {
      loadApplications();
    }
  }, [selectedJobId, statusFilter]);

  // Handle jobs result
  useEffect(() => {
    if (listJobsAction.status === "hasSucceeded" && listJobsAction.result?.data?.jobs) {
      setJobs(listJobsAction.result.data.jobs);
      
      // Check if there's a jobId in URL params
      const jobIdFromUrl = searchParams.get('jobId');
      if (jobIdFromUrl) {
        const jobId = parseInt(jobIdFromUrl);
        if (!isNaN(jobId)) {
          setSelectedJobId(jobId);
        }
      } else if (listJobsAction.result.data.jobs.length > 0) {
        setSelectedJobId(listJobsAction.result.data.jobs[0].id);
      }
    }
  }, [listJobsAction.status, listJobsAction.result, searchParams]);

  // Handle applications result
  useEffect(() => {
    if (getApplicationsAction.status === "hasSucceeded" && getApplicationsAction.result?.data?.applications) {
      setApplications(getApplicationsAction.result.data.applications);
      setLoading(false);
    } else if (getApplicationsAction.status === "hasErrored") {
      setLoading(false);
    }
  }, [getApplicationsAction.status, getApplicationsAction.result]);

  const loadApplications = () => {
    if (selectedJobId) {
      setLoading(true);
      getApplicationsAction.execute({
        jobOfferId: selectedJobId,
        status: statusFilter || undefined,
        limit: 50,
        offset: 0,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "reviewed":
        return "Examinée";
      case "accepted":
        return "Acceptée";
      case "rejected":
        return "Rejetée";
      default:
        return status;
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/jobs"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux offres d'emploi
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Candidatures d'emploi
              </h1>
              <p className="text-emerald-100">
                {applications.length > 0 
                  ? `${applications.length} candidature${applications.length > 1 ? 's' : ''} trouvée${applications.length > 1 ? 's' : ''}`
                  : "Gérez les candidatures pour les offres d'emploi"
                }
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/jobs"
                className="flex items-center gap-2 bg-white text-emerald-600 rounded-lg px-4 py-2 font-medium hover:bg-emerald-50 transition-colors shadow-md"
              >
                <Briefcase className="w-5 h-5" />
                Voir offres
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offre d'emploi
            </label>
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(Number(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Sélectionner une offre</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="reviewed">Examinée</option>
              <option value="accepted">Acceptée</option>
              <option value="rejected">Rejetée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      ) : selectedJobId ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Candidatures ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature
              </h3>
              <p className="text-gray-600">
                Aucune candidature trouvée pour cette offre d'emploi.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.firstName} {application.lastName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {application.email}
                          </p>
                          {application.phone && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Téléphone:</strong> {application.phone}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <strong>Postulé le:</strong> {formatDate(application.appliedAt)}
                          </p>
                        </div>
                        
                        <div>
                          {application.experience && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Expérience:</strong> {application.experience}
                            </p>
                          )}
                          {application.education && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Formation:</strong> {application.education}
                            </p>
                          )}
                          {application.expectedSalary && (
                            <p className="text-sm text-gray-600">
                              <strong>Salaire attendu:</strong> {application.expectedSalary}
                            </p>
                          )}
                        </div>
                      </div>

                      {application.coverLetter && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Lettre de motivation:</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {application.resumeUrl && (
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm hover:bg-emerald-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Voir CV
                          </a>
                        )}
                        {application.portfolioUrl && (
                          <a
                            href={application.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Portfolio
                          </a>
                        )}
                        {application.linkedinUrl && (
                          <a
                            href={application.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sélectionnez une offre d'emploi
          </h3>
          <p className="text-gray-600">
            Choisissez une offre d'emploi pour voir les candidatures.
          </p>
        </div>
      )}
    </div>
  );
}
