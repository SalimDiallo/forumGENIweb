"use client";
import { useAction } from "next-safe-action/hooks";
import { createJob, deleteJob, listJobs, updateJob, getJobsWithApplicationCount } from "./actions";
import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Star,
  Globe,
  Link2,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Award,
  Languages,
  ListChecks,
  Clock,
  Home,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import CreateJobModal from "./CreateJobs";
import EditJobs from "./EditJobs";

export default function AdminJobsPage() {
  const list = useAction(getJobsWithApplicationCount);
  const create = useAction(createJob);
  const del = useAction(deleteJob);
  const upd = useAction(updateJob);

  useEffect(() => {
    list.execute();
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Find the job being edited
  const editingItem = useMemo(
    () => list.result?.data?.jobs?.find((j: any) => j.id === editingId) ?? null,
    [editingId, list.result]
  );

  async function onDelete(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      del.execute({ id });
    }
  }

  useEffect(() => {
    if (create.status === "hasSucceeded") {
      list.execute();
      setOpenCreate(false);
    }
  }, [create.status]);

  useEffect(() => {
    if (upd.status === "hasSucceeded") {
      list.execute();
      setOpenEdit(false);
      setEditingId(null);
    }
  }, [upd.status]);

  useEffect(() => {
    if (del.status === "hasSucceeded") {
      list.execute();
    }
  }, [del.status]);

  // Options for select fields (should be kept in sync with CreateJobs.tsx and EditJobs.tsx)
  const jobTypeOptions = [
    { value: "stage", label: "Stage", color: "bg-blue-100 text-blue-800" },
    { value: "cdi", label: "CDI", color: "bg-emerald-100 text-emerald-800" },
    { value: "cdd", label: "CDD", color: "bg-yellow-100 text-yellow-800" },
    { value: "freelance", label: "Freelance", color: "bg-purple-100 text-purple-800" },
    { value: "alternance", label: "Alternance", color: "bg-pink-100 text-pink-800" },
    { value: "autre", label: "Autre", color: "bg-gray-100 text-gray-800" },
  ];

  const statusOptions = [
    { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
    { value: "published", label: "Publié", color: "bg-emerald-100 text-emerald-800" },
    { value: "archived", label: "Archivé", color: "bg-red-100 text-red-800" },
  ];

  const educationLevelOptions = [
    { value: "aucun", label: "Aucun" },
    { value: "bac", label: "Bac" },
    { value: "bac+2", label: "Bac+2" },
    { value: "bac+3", label: "Bac+3" },
    { value: "bac+5", label: "Bac+5" },
    { value: "doctorat", label: "Doctorat" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Annonces d'emploi</h1>
            <p className="text-blue-100">
              {list.result?.data?.jobs?.length || 0} annonce(s) au total
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/jobs/applications"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg px-4 py-3 font-medium transition-colors shadow-md"
            >
              <Users className="w-5 h-5" />
              Voir candidatures
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 bg-white text-blue-600 rounded-lg px-5 py-3 font-medium hover:bg-blue-50 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nouvelle annonce
            </button>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      <CreateJobModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          list.execute();
          setOpenCreate(false);
        }}
      />

      {/* Jobs List */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {list.status === "executing" && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {list.result?.data?.jobs?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucune annonce</p>
            <p className="text-sm">Commencez par créer votre première annonce</p>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {list.result?.data?.jobs?.map((j: any) => {
            const jobTypeOpt = jobTypeOptions.find((opt) => opt.value === j.jobType);
            const statusOpt = statusOptions.find((opt) => opt.value === j.status);
            return (
              <div
                key={j.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {j.title}
                      </h3>
                      {jobTypeOpt && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${jobTypeOpt.color}`}
                        >
                          {jobTypeOpt.label}
                        </span>
                      )}
                      {statusOpt && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusOpt.color}`}
                        >
                          {statusOpt.label}
                        </span>
                      )}
                      {j.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Vedette
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {j._count?.applications || 0} candidature{(j._count?.applications || 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {j.companyName}
                      </span>
                      {j.companyLogo && (
                        <img src={j.companyLogo} alt="Logo" className="w-6 h-6 rounded bg-white border ml-2" />
                      )}
                      {j.companyWebsite && (
                        <a href={j.companyWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                          <Globe className="w-4 h-4" />
                          Site
                        </a>
                      )}
                      {j.industry && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {j.industry}
                        </span>
                      )}
                      {j.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {j.location}
                        </span>
                      )}
                      {j.isRemote && (
                        <span className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          Télétravail
                        </span>
                      )}
                      {(j.salaryMin || j.salaryMax) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {j.salaryMin && j.salaryMax
                            ? `${j.salaryMin} - ${j.salaryMax}`
                            : j.salaryMin
                            ? `${j.salaryMin}`
                            : j.salaryMax
                            ? `${j.salaryMax}`
                            : ""}
                          {j.salaryCurrency && ` ${j.salaryCurrency}`}
                          {j.salaryPeriod && ` /${j.salaryPeriod}`}
                        </span>
                      )}
                      {j.experienceRequired && (
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {j.experienceRequired}
                        </span>
                      )}
                      {j.educationLevel && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {j.educationLevel}
                        </span>
                      )}
                      {j.contractDuration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {j.contractDuration}
                        </span>
                      )}
                      {j.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Début: {new Date(j.startDate).toLocaleDateString()}
                        </span>
                      )}
                      {j.skillsRequired && (
                        <span className="flex items-center gap-1">
                          <ListChecks className="w-4 h-4" />
                          {j.skillsRequired}
                        </span>
                      )}
                      {j.languagesRequired && (
                        <span className="flex items-center gap-1">
                          <Languages className="w-4 h-4" />
                          {j.languagesRequired}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/jobs/applications?jobId=${j.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Candidatures
                    </Link>
                    <button
                      onClick={() => {
                        setEditingId(j.id);
                        setOpenEdit(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => onDelete(j.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {j.description}
                </div>
                {j.requirements && (
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="font-semibold">Exigences: </span>{j.requirements}
                  </div>
                )}
                {j.benefits && (
                  <div className="mt-1 text-xs text-gray-500">
                    <span className="font-semibold">Avantages: </span>{j.benefits}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  {j.applicationEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {j.applicationEmail}
                    </span>
                  )}
                  {j.applicationUrl && (
                    <a href={j.applicationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Link2 className="w-3 h-3" />
                      Candidater
                    </a>
                  )}
                  {j.applicationPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {j.applicationPhone}
                    </span>
                  )}
                  {j.applicationDeadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Limite: {new Date(j.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit Modal */}
      <EditJobs
        open={openEdit && !!editingItem}
        onClose={() => {
          setOpenEdit(false);
          setEditingId(null);
        }}
        editingId={editingId}
        jobs={list.result?.data?.jobs || []}
        onSubmitEdit={(values) => upd.execute(values)}
        upd={upd}
        jobTypeOptions={jobTypeOptions}
        statusOptions={statusOptions}
        educationLevelOptions={educationLevelOptions}
        setEditingId={setEditingId}
        setOpenEdit={setOpenEdit}
      />
    </div>
  );
}
