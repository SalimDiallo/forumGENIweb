"use client";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { updateEventSchema } from "../event.edit.schema";
import SponsorsPreview from "@/components/admin/SponsorsPreview";

interface EventAdvancedFieldsProps {
  register: UseFormRegister<updateEventSchema>;
  errors: FieldErrors<updateEventSchema>;
  watch?: UseFormWatch<updateEventSchema>;
}

export default function EventAdvancedFields({
  register,
  errors,
  watch,
}: EventAdvancedFieldsProps) {
  const sponsorsValue = watch?.("sponsors") || "";
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date de début *
          </label>
          <input
            id="startDate"
            type="datetime-local"
            {...register("startDate")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date de fin *
          </label>
          <input
            id="endDate"
            type="datetime-local"
            {...register("endDate")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.endDate && (
            <p className="text-red-600 text-sm mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lieu
          </label>
          <input
            id="location"
            {...register("location")}
            placeholder="Ex: Université, Casablanca"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="isVirtual"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Virtuel ?
          </label>
          <select
            id="isVirtual"
            {...register("isVirtual", { setValueAs: v => v === "true" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
          {errors.isVirtual && (
            <p className="text-red-600 text-sm mt-1">
              {errors.isVirtual.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="virtualLink"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lien virtuel (si applicable)
          </label>
          <input
            id="virtualLink"
            {...register("virtualLink")}
            placeholder="https://meet.example.com/..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.virtualLink && (
            <p className="text-red-600 text-sm mt-1">
              {errors.virtualLink.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="isFeatured"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            À la une ?
          </label>
          <select
            id="isFeatured"
            {...register("isFeatured", { setValueAs: v => v === "true" })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
          {errors.isFeatured && (
            <p className="text-red-600 text-sm mt-1">
              {errors.isFeatured.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="organizerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Organisateur
          </label>
          <input
            id="organizerName"
            {...register("organizerName")}
            placeholder="Nom de l'organisateur"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.organizerName && (
            <p className="text-red-600 text-sm mt-1">
              {errors.organizerName.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="agenda"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Agenda (Markdown)
          </label>
          <textarea
            id="agenda"
            {...register("agenda")}
            placeholder="Programme de l'événement"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
          {errors.agenda && (
            <p className="text-red-600 text-sm mt-1">
              {errors.agenda.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="speakers"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Intervenants (Markdown)
          </label>
          <textarea
            id="speakers"
            {...register("speakers")}
            placeholder="Liste des intervenants"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
          {errors.speakers && (
            <p className="text-red-600 text-sm mt-1">
              {errors.speakers.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="sponsors"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sponsors (JSON)
          </label>
          <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-800 font-medium mb-2">Format JSON attendu :</p>
            <pre className="text-xs text-blue-700 overflow-x-auto">
                {`[
                  {
                    "name": "Nom Sponsor",
                    "logo": "/uploads/sponsors/logo.png",
                    "website": "https://site.com",
                    "tier": "platinum"
                  }
                ]`}
            </pre>
            <p className="text-blue-700 text-xs mt-2">
              Tiers disponibles: <span className="font-semibold">platinum, gold, silver, bronze</span> (optionnel)
            </p>
          </div>
          <textarea
            id="sponsors"
            {...register("sponsors")}
            placeholder='[{"name": "Sponsor", "logo": "/uploads/sponsors/logo.png", "website": "https://example.com", "tier": "gold"}]'
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
          {errors.sponsors && (
            <p className="text-red-600 text-sm mt-1">
              {errors.sponsors.message}
            </p>
          )}
          {/* Prévisualisation des sponsors */}
          {watch && <SponsorsPreview jsonValue={sponsorsValue} />}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Prérequis (Markdown)
          </label>
          <textarea
            id="requirements"
            {...register("requirements")}
            placeholder="Prérequis pour participer"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
          {errors.requirements && (
            <p className="text-red-600 text-sm mt-1">
              {errors.requirements.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="whatToBring"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            À apporter (Markdown)
          </label>
          <textarea
            id="whatToBring"
            {...register("whatToBring")}
            placeholder="Ce que les participants doivent apporter"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
          />
          {errors.whatToBring && (
            <p className="text-red-600 text-sm mt-1">
              {errors.whatToBring.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
