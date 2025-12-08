"use client";
import { Control, FieldErrors } from "react-hook-form";
import MarkdownEditor from "@/components/MarkdownEditor";
import { eventTypeOptions, statusOptions } from "@/lib/utils";
import { updateEventSchema } from "../event.edit.schema";
import { AlertCircle } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import Input from "@/components/ui/InputField";

interface EventBasicFieldsProps {
  control: Control<updateEventSchema>;
  errors: FieldErrors<updateEventSchema>;
  isEditor?: boolean;
}

export default function EventBasicFields({
  control,
  errors,
  isEditor = false,
}: EventBasicFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Title */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre de l&apos;événement *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder="Ex: Forum Entrepreneuriat 2025"
                    error={!!errors.title}
                    errorMessage={errors.title?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Slug */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (URL) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="forum-entrepreneuriat-2025"
                    error={!!errors.slug}
                    errorMessage={errors.slug?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Event Type */}
        <div>
          <FormField
            control={control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d&apos;événement *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {eventTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <div>
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Statut *
                  {isEditor && (
                    <span className="ml-2 text-xs text-amber-600 font-normal">
                      (Brouillon uniquement)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
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
                </FormControl>
                {isEditor && (
                  <FormDescription className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    En tant qu&apos;éditeur, vous ne pouvez créer que des brouillons
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Short Description */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description courte</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Résumé en une phrase"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description (Markdown) */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description complète (Markdown supporté)</FormLabel>
                <FormControl>
                  <MarkdownEditor
                    value={field.value || ""}
                    onChange={(val) => field.onChange(val)}
                    placeholder="Description détaillée de l'événement (supporte Markdown)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Featured Image */}
        <div className="col-span-2">
          <FormField
            control={control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image principale (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/image.jpg"
                    error={!!errors.featuredImage}
                    errorMessage={errors.featuredImage?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
