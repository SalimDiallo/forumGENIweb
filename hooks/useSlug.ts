/**
 * useSlug - Custom hook for automatic slug generation
 *
 * This hook manages slug generation with auto/manual modes:
 * - Auto mode: Automatically generates slug from source text
 * - Manual mode: Allows user to manually edit the slug
 */

import { useState, useEffect, useRef } from "react";
import { slugify } from "@/lib/form-utils";

/**
 * Slug mode type
 */
export type SlugMode = "auto" | "custom";

/**
 * useSlug hook options
 */
export interface UseSlugOptions {
  /** Source text to generate slug from (e.g., title) */
  sourceText: string;
  /** Initial slug value */
  initialSlug?: string;
  /** Callback when slug changes */
  onSlugChange?: (slug: string) => void;
}

/**
 * useSlug hook return type
 */
export interface UseSlugReturn {
  /** Current slug value */
  slug: string;
  /** Current slug mode (auto or custom) */
  mode: SlugMode;
  /** Ref for slug input (for focus management) */
  slugInputRef: React.RefObject<HTMLInputElement>;
  /** Set slug value */
  setSlug: (value: string) => void;
  /** Switch to custom mode and focus input */
  enableCustomMode: () => void;
  /** Switch to auto mode */
  enableAutoMode: () => void;
  /** Toggle between auto and custom mode */
  toggleMode: () => void;
}

/**
 * Custom hook for slug management
 *
 * @param options - Slug options
 * @returns Slug state and handlers
 *
 * @example
 * ```typescript
 * const slug = useSlug({
 *   sourceText: form.title,
 *   onSlugChange: (value) => form.setFieldValue("slug", value),
 * });
 *
 * // Display
 * <input
 *   ref={slug.mode === "custom" ? slug.slugInputRef : undefined}
 *   value={slug.slug}
 *   readOnly={slug.mode === "auto"}
 *   onChange={(e) => slug.setSlug(e.target.value)}
 * />
 * <button onClick={slug.enableCustomMode}>Edit</button>
 * ```
 */
export function useSlug({
  sourceText,
  initialSlug = "",
  onSlugChange,
}: UseSlugOptions): UseSlugReturn {
  const [slug, setSlugState] = useState(initialSlug);
  const [mode, setMode] = useState<SlugMode>("auto");
  const slugInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  // Auto-generate slug from source text when in auto mode
  useEffect(() => {
    if (mode === "auto" && sourceText) {
      const generatedSlug = slugify(sourceText);
      if (generatedSlug !== slug) {
        setSlugState(generatedSlug);
        onSlugChange?.(generatedSlug);
      }
    }
  }, [sourceText, mode, slug, onSlugChange]);

  // Set slug value
  const setSlug = (value: string) => {
    const slugified = slugify(value);
    setSlugState(slugified);
    onSlugChange?.(slugified);
  };

  // Enable custom mode and focus input
  const enableCustomMode = () => {
    setMode("custom");
    // Focus and select input after mode change
    setTimeout(() => {
      slugInputRef.current?.focus();
      slugInputRef.current?.select();
    }, 0);
  };

  // Enable auto mode
  const enableAutoMode = () => {
    setMode("auto");
    // Regenerate slug from source text
    const generatedSlug = slugify(sourceText);
    setSlugState(generatedSlug);
    onSlugChange?.(generatedSlug);
  };

  // Toggle mode
  const toggleMode = () => {
    if (mode === "auto") {
      enableCustomMode();
    } else {
      enableAutoMode();
    }
  };

  return {
    slug,
    mode,
    slugInputRef,
    setSlug,
    enableCustomMode,
    enableAutoMode,
    toggleMode,
  };
}
