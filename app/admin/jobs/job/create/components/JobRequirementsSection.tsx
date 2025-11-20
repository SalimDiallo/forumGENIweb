"use client";
import { Control, Controller, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";

interface JobRequirementsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  isExecuting?: boolean;
}

const educationLevelOptions = [
  { value: "aucun", label: "Aucun" },
  { value: "bac", label: "Bac" },
  { value: "bac+2", label: "Bac+2" },
  { value: "bac+3", label: "Bac+3" },
  { value: "bac+5", label: "Bac+5" },
  { value: "doctorat", label: "Doctorat" },
];

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "archived", label: "Archivé" },
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

// TagInput component
function TagInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      const newTags = [...tags, ...parts.slice(0, -1).map((t) => t.trim()).filter(Boolean)];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput(parts[parts.length - 1]);
    } else {
      setInput(val);
    }
  }

  function handleInputBlur() {
    if (input.trim()) {
      const newTags = [...tags, input.trim()];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput("");
    }
  }

  function handleRemoveTag(idx: number) {
    const newTags = tags.filter((_, i) => i !== idx);
    onChange(newTags.join(","));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === "Tab") && input.trim()) {
      e.preventDefault();
      const newTags = [...tags, input.trim()];
      const uniqueTags = Array.from(new Set(newTags));
      onChange(uniqueTags.join(","));
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      handleRemoveTag(tags.length - 1);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-2 py-2.5 bg-white focus-within:ring-2 focus-within:ring-emerald-500">
      {tags.map((tag, idx) => (
        <span
          key={tag + idx}
          className="flex items-center bg-emerald-100 text-emerald-800 rounded px-2 py-1 text-xs font-medium mr-1"
        >
          {tag}
          <button
            type="button"
            className="ml-1 text-emerald-600 hover:text-red-500 focus:outline-none"
            onClick={() => handleRemoveTag(idx)}
            tabIndex={-1}
            aria-label={`Supprimer ${tag}`}
            disabled={disabled}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm"
        disabled={disabled}
      />
    </div>
  );
}

export default function JobRequirementsSection({
  register,
  errors,
  control,
  watch,
  setValue,
  isExecuting,
}: JobRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField
            label="Description (optionnel)"
            error={errors.description?.message}
            description="Vous pouvez utiliser le markdown pour mettre en forme la description du poste."
          >
            <MarkdownEditor
              value={watch("description") || ""}
              onChange={value => setValue("description", value, { shouldValidate: true })}
              placeholder="Description du poste (markdown supporté)"
            />
          </FormField>
        </div>

        <div className="col-span-2">
          <FormField
            label="Exigences (optionnel)"
            error={errors.requirements?.message}
            description="Listez les exigences du poste, séparées par des virgules. Appuyez sur Entrée ou tapez une virgule pour ajouter."
          >
            <Controller
              control={control}
              name="requirements"
              render={({ field }) => (
                <TagInput
                  value={field.value || ""}
                  onChange={val => field.onChange(val)}
                  placeholder="ex: React, Node.js, SQL"
                  disabled={isExecuting}
                />
              )}
            />
          </FormField>
        </div>

        <div className="col-span-2">
          <FormField
            label="Avantages (optionnel)"
            error={errors.benefits?.message}
            description="Listez les avantages proposés, séparés par des virgules. Appuyez sur Entrée ou tapez une virgule pour ajouter."
          >
            <Controller
              control={control}
              name="benefits"
              render={({ field }) => (
                <TagInput
                  value={field.value || ""}
                  onChange={val => field.onChange(val)}
                  placeholder="ex: Tickets resto, Mutuelle, Télétravail"
                  disabled={isExecuting}
                />
              )}
            />
          </FormField>
        </div>

        <div>
          <FormField label="Expérience requise (optionnel)" error={errors.experienceRequired?.message}>
            <input
              {...register("experienceRequired")}
              placeholder="ex: 2 ans"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Niveau d'études (optionnel)" error={errors.educationLevel?.message}>
            <select
              {...register("educationLevel")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Sélectionner (optionnel)</option>
              {educationLevelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Durée du contrat (optionnel)" error={errors.contractDuration?.message}>
            <input
              {...register("contractDuration")}
              placeholder="ex: 6 mois"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Date de début (optionnel)" error={errors.startDate?.message}>
            <input
              {...register("startDate")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="date"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Compétences requises (optionnel)" error={errors.skillsRequired?.message}>
            <Controller
              control={control}
              name="skillsRequired"
              render={({ field }) => (
                <TagInput
                  value={field.value || ""}
                  onChange={val => field.onChange(val)}
                  placeholder="ex: React, Node.js, SQL"
                  disabled={isExecuting}
                />
              )}
            />
          </FormField>
        </div>

        <div>
          <FormField
            label="Langues requises (optionnel)"
            error={errors.languagesRequired?.message}
            description="Listez les langues requises, séparées par des virgules."
          >
            <Controller
              control={control}
              name="languagesRequired"
              render={({ field }) => (
                <TagInput
                  value={field.value || ""}
                  onChange={val => field.onChange(val)}
                  placeholder="ex: Français, Anglais"
                  disabled={isExecuting}
                />
              )}
            />
          </FormField>
        </div>

        <div>
          <FormField label="Salaire min (optionnel)" error={errors.salaryMin?.message}>
            <input
              {...register("salaryMin", { valueAsNumber: true })}
              placeholder="Salaire min"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="number"
              min={0}
            />
          </FormField>
        </div>

        <div>
          <FormField label="Salaire max (optionnel)" error={errors.salaryMax?.message}>
            <input
              {...register("salaryMax", { valueAsNumber: true })}
              placeholder="Salaire max"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              type="number"
              min={0}
            />
          </FormField>
        </div>

        <div>
          <FormField label="Devise (optionnel)" error={errors.salaryCurrency?.message}>
            <input
              {...register("salaryCurrency")}
              placeholder="MAD, EUR, USD..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Période (optionnel)" error={errors.salaryPeriod?.message}>
            <input
              {...register("salaryPeriod")}
              placeholder="ex: month"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </FormField>
        </div>

        <div>
          <FormField label="Statut (optionnel)" error={errors.status?.message}>
            <select
              {...register("status")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Sélectionner (optionnel)</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Mettre en avant (optionnel)" error={errors.isFeatured?.message}>
            <select
              {...register("isFeatured", { setValueAs: (value) => value === "" ? undefined : value === "true" })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Non spécifié</option>
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
}
