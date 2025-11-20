"use client";
import { UseFormRegister, FieldErrors, Control, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface JobDetailsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control?: Control<any>;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
}

const jobTypeOptions = [
  { value: "stage", label: "Stage" },
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "freelance", label: "Freelance" },
  { value: "alternance", label: "Alternance" },
  { value: "autre", label: "Autre" },
];

function FormField({
  label,
  children,
  error,
  description,
}: {
  label: string;
  children: React.ReactNode;
  error?: any;
  description?: string;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message;
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {description && <span className="text-xs text-gray-500 mb-1">{description}</span>}
      {children}
      {errorMessage && <span className="text-xs text-red-500 mt-1">{errorMessage}</span>}
    </div>
  );
}

export default function JobDetailsSection({
  register,
  errors,
}: JobDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField label="Titre du poste *" error={errors.title?.message}>
            <input
              {...register("title")}
              placeholder="Ex: Développeur React Senior"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
          </FormField>
        </div>

        <div>
          <FormField label="Entreprise *" error={errors.companyName?.message}>
            <input
              {...register("companyName")}
              placeholder="Nom de l'entreprise"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Secteur d'activité (optionnel)" error={errors.industry?.message}>
            <input
              {...register("industry")}
              placeholder="ex: Informatique, Finance..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Type de contrat (optionnel)" error={errors.jobType?.message}>
            <select
              {...register("jobType")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Sélectionner (optionnel)</option>
              {jobTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Lieu (optionnel)" error={errors.location?.message}>
            <input
              {...register("location")}
              placeholder="Ville, Pays"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Télétravail (optionnel)" error={errors.isRemote?.message}>
            <select
              {...register("isRemote", { setValueAs: (value) => value === "" ? undefined : value === "true" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Non spécifié</option>
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Logo de l'entreprise (optionnel)" error={errors.companyLogo?.message}>
            <input
              {...register("companyLogo")}
              placeholder="URL du logo (optionnel)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="url"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Site web de l'entreprise (optionnel)" error={errors.companyWebsite?.message}>
            <input
              {...register("companyWebsite")}
              placeholder="https://entreprise.com (optionnel)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="url"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
