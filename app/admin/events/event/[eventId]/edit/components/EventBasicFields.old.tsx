"use client";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import MarkdownEditor from "@/components/MarkdownEditor";
import { eventTypeOptions, statusOptions } from "@/lib/utils";
import { updateEventSchema } from "../event.edit.schema";
import { AlertCircle } from "lucide-react";

interface EventBasicFieldsProps {
  register: UseFormRegister<updateEventSchema>;
  errors: FieldErrors<updateEventSchema>;
  setValue: UseFormSetValue<updateEventSchema>;
  watch: UseFormWatch<updateEventSchema>;
  isEditor?: boolean;
}

export default function EventBasicFields({
  register,
  errors,
  setValue,
  watch,
  isEditor = false,
}: EventBasicFieldsProps) {
  const descriptionValue = watch("description");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Titre de l&apos;événement *
          </label>
          <input
            id="title"
            autoFocus
            {...register("title")}
            placeholder="Ex: Forum Entrepreneuriat 2025"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Slug (URL) *
          </label>
          <input
            id="slug"
            {...register("slug")}
            placeholder="forum-entrepreneuriat-2025"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.slug && (
            <p className="text-red-600 text-sm mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="eventType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type d&apos;événement *
          </label>
          <select
            id="eventType"
            {...register("eventType")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {eventTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.eventType && (
            <p className="text-red-600 text-sm mt-1">
              {errors.eventType.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Statut *
            {isEditor && (
              <span className="ml-2 text-xs text-amber-600 font-normal">
                (Brouillon uniquement)
              </span>
            )}
          </label>
          <select
            id="status"
            {...register("status")}
            disabled={isEditor}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
              isEditor ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
            }`}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">
              {errors.status.message}
            </p>
          )}
          {isEditor && (
            <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              En tant qu'éditeur, vous ne pouvez créer que des brouillons
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description courte
          </label>
          <textarea
            id="shortDescription"
            {...register("shortDescription")}
            placeholder="Résumé en une phrase"
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.shortDescription && (
            <p className="text-red-600 text-sm mt-1">
              {errors.shortDescription.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description complète (Markdown supporté)
          </label>
          <MarkdownEditor
            value={descriptionValue || ""}
            onChange={(val) =>
              setValue("description", val, { shouldValidate: true })
            }
            placeholder="Description détaillée de l'événement (supporte Markdown)"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="featuredImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image principale (URL)
          </label>
          <input
            id="featuredImage"
            {...register("featuredImage")}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {errors.featuredImage && (
            <p className="text-red-600 text-sm mt-1">
              {errors.featuredImage.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
