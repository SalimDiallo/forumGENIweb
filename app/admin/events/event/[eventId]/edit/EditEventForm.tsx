"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings, UserCheck, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { slugify } from "@/lib/utils";
import { Event } from "@/lib/generated/prisma";
import { updateEventSchema } from "./event.edit.schema";
import { useMutation } from "@tanstack/react-query";
import { doEditEvent } from "./event.edit.action";
import { useRouter } from "next/navigation";
import EventBasicFields from "./components/EventBasicFields";
import EventAdvancedFields from "./components/EventAdvancedFields";
import EventRegistrationFields from "./components/EventRegistrationFields";

type FormTab = "basic" | "details" | "registration";

type EditEventFormProps = {
  event: Event;
};

function cleanDefaultValues<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = { ...obj };

  const stringFields = [
    "title",
    "slug",
    "description",
    "shortDescription",
    "featuredImage",
    "location",
    "address",
    "city",
    "country",
    "registrationUrl",
    "registrationEmail",
    "registrationPhone",
    "registrationForm",
    "organizer",
    "organizerWebsite",
    "organizerEmail",
    "organizerPhone",
    "agenda",
    "speakers",
    "sponsors",
    "requirements",
    "whatToBring",
    "virtualLink",
    "registrationLink"
  ];
  for (const key of stringFields) {
    if (key in cleaned && cleaned[key] === null) {
      cleaned[key] = undefined;
    }
  }
  if (cleaned.startDate)
    cleaned.startDate = new Date(cleaned.startDate).toISOString().slice(0, 16);
  if (cleaned.endDate)
    cleaned.endDate = new Date(cleaned.endDate).toISOString().slice(0, 16);
  if (cleaned.registrationStart)
    cleaned.registrationStart = cleaned.registrationStart
      ? new Date(cleaned.registrationStart).toISOString().slice(0, 16)
      : undefined;
  if (cleaned.registrationEnd)
    cleaned.registrationEnd = cleaned.registrationEnd
      ? new Date(cleaned.registrationEnd).toISOString().slice(0, 16)
      : undefined;
  return cleaned as T;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const cleanedDefaultValues = cleanDefaultValues(event);
  console.log(cleanedDefaultValues);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<updateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      id: cleanedDefaultValues.id,
      title: cleanedDefaultValues.title,
      slug: cleanedDefaultValues.slug,
      eventType: cleanedDefaultValues.eventType,
      organizerName: cleanedDefaultValues.organizerName,
      startDate: new Date(cleanedDefaultValues.startDate).toISOString().slice(0, 16),
      endDate: new Date(cleanedDefaultValues.endDate).toISOString().slice(0, 16),
      isFree: cleanedDefaultValues.isFree,
      price: cleanedDefaultValues.price,
      currency: cleanedDefaultValues.currency,
      status: cleanedDefaultValues.status,
      isFeatured: Boolean(cleanedDefaultValues.isFeatured),
      sponsors: cleanedDefaultValues.sponsors ?? "",
      agenda: cleanedDefaultValues.agenda ?? "",
      speakers: cleanedDefaultValues.speakers ?? "",
      requirements: cleanedDefaultValues.requirements ?? "",
      whatToBring: cleanedDefaultValues.whatToBring ?? "",
      isVirtual: cleanedDefaultValues.isVirtual,
      shortDescription: cleanedDefaultValues.shortDescription ?? "",
      description: cleanedDefaultValues.description ?? "",
      featuredImage: cleanedDefaultValues.featuredImage ?? "",
      registrationStart: cleanedDefaultValues.registrationStart ? new Date(cleanedDefaultValues.registrationStart).toISOString().slice(0, 16) : undefined,
      registrationEnd: cleanedDefaultValues.registrationEnd ? new Date(cleanedDefaultValues.registrationEnd).toISOString().slice(0, 16) : undefined,
      maxParticipants: cleanedDefaultValues.maxParticipants ?? undefined,
      location: cleanedDefaultValues.location ?? undefined,
      registrationLink: cleanedDefaultValues.registrationLink ?? "",
    },
  });

  const editEventMutation = useMutation({
    mutationFn: async (data: updateEventSchema) => {
      const result = await doEditEvent(data);
      if (result.serverError) {
        throw new Error("Failed to create event");
      } else {
        router.push("/admin/events");
      }
    }
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");

  const initialTitleRef = useRef<string | undefined>(cleanedDefaultValues?.title);

  useEffect(() => {
    if (typeof titleValue !== "string") return;
    const autoSlug = slugify(titleValue);
    if (
      (!slugValue ||
        slugValue === "" ||
        slugValue === slugify(initialTitleRef.current || "")) &&
      autoSlug !== slugValue
    ) {
      setValue("slug", autoSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [titleValue]);

  const tabs = [
    { id: "basic" as FormTab, label: "Informations de base", icon: FileText },
    { id: "details" as FormTab, label: "Détails", icon: Settings },
    { id: "registration" as FormTab, label: "Inscription", icon: UserCheck },
  ];

  async function onSubmit(data: updateEventSchema) {
    editEventMutation.mutateAsync(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="max-h-[60vh] overflow-y-auto px-1">
          {activeTab === "basic" && (
            <EventBasicFields
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}

          {activeTab === "details" && (
            <EventAdvancedFields
              register={register}
              errors={errors}
            />
          )}

          {activeTab === "registration" && (
            <>
              <EventRegistrationFields
                register={register}
                errors={errors}
              />
              {/* Ajout du champ "Registration Link" (URL d'inscription) */}
              <div className="my-4">
                <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Lien d'inscription <span className="text-gray-400 italic">(optionnel)</span>
                </label>
                <input
                  id="registrationLink"
                  type="url"
                  placeholder="https://..."
                  {...register("registrationLink")}
                  className={`block w-full px-3 py-3 my-3 border ${
                    errors.registrationLink ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                />
                {errors.registrationLink && (
                  <p className="text-red-500 text-xs mt-1">{errors.registrationLink.message as string}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="submit"
            disabled={editEventMutation.isPending}
            className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-6 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {editEventMutation.isPending ? "Sauvegarde…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}