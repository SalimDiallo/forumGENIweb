import { Briefcase, MapPin, DollarSign, Edit, AlertCircle, Calendar, Building, Globe } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import BackButton from "@/components/BackButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function JobDetailsPage(props: { params: Promise<{ jobId: string }> }) {
  const params = await props.params;
  const jobId = parseInt(params.jobId, 10);

  let job = null;
  if (jobId && !isNaN(jobId)) {
    job = await prisma.jobOffer.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      return (
        <div className="container py-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offre introuvable</h2>
          <p className="text-gray-600 mb-6">L'offre d'emploi que vous recherchez n'existe pas ou a été supprimée.</p>
          <Link href="/admin/jobs" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold transition">
            Retour à la liste des jobs
          </Link>
        </div>
      );
    }
  } else {
    return (
      <div className="container py-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Offre introuvable</h2>
        <p className="text-gray-600 mb-6">L'offre d'emploi que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link href="/admin/jobs" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-3 font-semibold transition">
          Retour à la liste des jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <BackButton />
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/jobs/job/${jobId}/edit`}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 py-2.5 font-semibold transition shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg px-6 py-2.5 font-semibold transition shadow-lg"
                // onClick={() => {
                //   if (typeof window !== "undefined") {
                //     navigator.clipboard.writeText(window.location.href);
                //   }
                // }}
                title="Partager"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8a3 3 0 10-6 0v8a3 3 0 006 0m6-5l-3-3m0 0l-3 3m3-3V21" />
                </svg>
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-emerald-50">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.jobType && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      <span className="capitalize">{job.jobType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations générales</h3>
                <div className="space-y-3">
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{job.salaryMin} - {job.salaryMax} {job.salaryCurrency || ''}</span>
                    </div>
                  )}
                  {job.companyWebsite && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        {job.companyWebsite}
                      </a>
                    </div>
                  )}
                  {job.applicationDeadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Échéance : {new Date(job.applicationDeadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {job.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <MarkdownRenderer content={job.description} />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                <div className="space-y-2 text-gray-700">
                  {job.applicationEmail && <p>Email : {job.applicationEmail}</p>}
                  {job.applicationPhone && <p>Téléphone : {job.applicationPhone}</p>}
                  {job.applicationUrl && (
                    <p>
                      URL : <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        {job.applicationUrl}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Statut</h3>
                <span className={`inline-block px-3 py-1  text-sm font-medium ${
                  job.status === 'published' ? 'bg-green-100 text-green-800' :
                  job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Statistiques</h3>
                <p className="text-gray-600">Vues : {job.viewsCount}</p>
                <p className="text-gray-600 text-xs mt-1">
                  Créé le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
