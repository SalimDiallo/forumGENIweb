"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { createJobOfferSchema } from "../job.create.schema";

interface JobApplicationSectionProps {
  register: UseFormRegister<z.infer<typeof createJobOfferSchema>>;
  errors: FieldErrors<z.infer<typeof createJobOfferSchema>>;
}

function FormField({
  label,
  children,
  error,
  description,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {description && <span className="text-xs text-gray-500 mb-1">{description}</span>}
      {children}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}

export default function JobApplicationSection({
  register,
  errors,
}: JobApplicationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FormField
            label="Email de candidature (optionnel)"
            error={errors.applicationEmail?.message}
            description="Email pour postuler (optionnel)"
          >
            <input
              {...register("applicationEmail")}
              placeholder="ex: jobs@entreprise.com (optionnel)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="email"
            />
          </FormField>
        </div>

        <div>
          <FormField
            label="URL de candidature (optionnel)"
            error={errors.applicationUrl?.message}
            description="Lien vers le formulaire de candidature (optionnel)"
          >
            <input
              {...register("applicationUrl")}
              placeholder="Lien vers le formulaire de candidature (optionnel)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="url"
            />
          </FormField>
        </div>

        <div>
          <FormField
            label="Téléphone de contact (optionnel)"
            error={errors.applicationPhone?.message}
            description="Numéro de téléphone pour postuler (optionnel)"
          >
            <input
              {...register("applicationPhone")}
              placeholder="Numéro de téléphone (optionnel)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="tel"
            />
          </FormField>
        </div>

        <div>
          <FormField
            label="Date limite de candidature (optionnel)"
            error={errors.applicationDeadline?.message}
            description="Date limite pour postuler (optionnel)"
          >
            <input
              {...register("applicationDeadline", {
                setValueAs: (val) => val ? new Date(val) : undefined
              })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="date"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
