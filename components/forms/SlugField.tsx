/**
 * SlugField - Reusable slug input component
 *
 * Features:
 * - Auto/custom mode toggle
 * - Visual indicator of mode
 * - Focus management
 * - Error display
 */

"use client";

import React from "react";
import { Pencil } from "lucide-react";
import type { SlugMode } from "@/hooks/useSlug";

export interface SlugFieldProps {
  /** Current slug value */
  value: string;
  /** Slug mode (auto or custom) */
  mode: SlugMode;
  /** Input ref for focus management */
  inputRef?: React.RefObject<HTMLInputElement>;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Edit button click handler (switch to custom mode) */
  onEditClick: () => void;
  /** Auto button click handler (switch to auto mode) */
  onAutoClick: () => void;
  /** Error message */
  error?: string;
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Reusable slug field component
 *
 * @example
 * ```typescript
 * const slug = useSlug({ sourceText: title });
 *
 * <SlugField
 *   value={slug.slug}
 *   mode={slug.mode}
 *   inputRef={slug.slugInputRef}
 *   onChange={slug.setSlug}
 *   onEditClick={slug.enableCustomMode}
 *   onAutoClick={slug.enableAutoMode}
 *   error={form.getError("slug")}
 * />
 * ```
 */
export default function SlugField({
  value,
  mode,
  inputRef,
  onChange,
  onBlur,
  onEditClick,
  onAutoClick,
  error,
  label = "Slug",
  placeholder = "slug-automatique",
}: SlugFieldProps) {
  const isAutoMode = mode === "auto";

  return (
    <div className="relative group">
      <label className="block font-medium mb-1">
        {label}
        <span className="ml-1 inline text-xs text-gray-400">
          {isAutoMode ? "(généré automatiquement)" : "(personnalisé)"}
        </span>
      </label>

      <div className="flex items-center gap-2">
        {/* Slug Input */}
        <input
          name="slug"
          type="text"
          value={value}
          readOnly={isAutoMode}
          ref={mode === "custom" ? inputRef : undefined}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onBlur={onBlur}
          placeholder={placeholder}
          className={
            isAutoMode
              ? "flex-1 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-500 focus:outline-none cursor-not-allowed"
              : `flex-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 ${
                  error ? "border-red-300" : "border-gray-300"
                }`
          }
          style={isAutoMode ? { pointerEvents: "none" } : {}}
          aria-invalid={!!error}
          aria-describedby={error ? "slug-error" : undefined}
        />

        {/* Mode Toggle Buttons */}
        {isAutoMode ? (
          <button
            type="button"
            aria-label="Personnaliser le slug"
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={onEditClick}
            tabIndex={0}
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Revenir au mode automatique"
            className="px-3 py-2 rounded hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors"
            onClick={onAutoClick}
            tabIndex={0}
          >
            Auto
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <span id="slug-error" className="text-red-600 text-xs mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}
