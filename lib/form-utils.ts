/**
 * FORM UTILITIES - Reusable form helpers
 *
 * This file contains utility functions and hooks for form management
 * that can be reused across all forms in the application.
 */

import { z } from "zod";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Field error structure
 */
export type FieldError = {
  field: string;
  message: string;
};

/**
 * Form errors collection
 */
export type FormErrors = Record<string, FieldError>;

/**
 * Form touched fields tracker
 */
export type FormTouched = Record<string, boolean>;

/**
 * Slug mode type
 */
export type SlugMode = "auto" | "custom";

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Convert Zod validation errors to FormErrors format
 *
 * @param zodError - Zod validation error
 * @returns FormErrors object
 *
 * @example
 * ```typescript
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const errors = zodErrorsToFormErrors(result.error);
 *   setErrors(errors);
 * }
 * ```
 */
export function zodErrorsToFormErrors(zodError: z.ZodError): FormErrors {
  const errors: FormErrors = {};

  for (const issue of zodError.issues) {
    if (issue.path && issue.path[0]) {
      const fieldName = issue.path[0] as string;
      errors[fieldName] = {
        field: fieldName,
        message: issue.message,
      };
    }
  }

  return errors;
}

/**
 * Validate form data using a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Form data to validate
 * @returns FormErrors object (empty if no errors)
 *
 * @example
 * ```typescript
 * const errors = validateWithZod(createEventSchema, formData);
 * if (Object.keys(errors).length === 0) {
 *   // Form is valid
 * }
 * ```
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): FormErrors {
  const result = schema.safeParse(data);

  if (!result.success) {
    return zodErrorsToFormErrors(result.error);
  }

  return {};
}

/**
 * Get error message for a specific field
 *
 * @param field - Field name
 * @param errors - Form errors object
 * @param touched - Form touched object
 * @returns Error message or undefined
 *
 * @example
 * ```typescript
 * const errorMsg = getFieldError("email", errors, touched);
 * if (errorMsg) {
 *   // Show error message
 * }
 * ```
 */
export function getFieldError(
  field: string,
  errors: FormErrors,
  touched: FormTouched
): string | undefined {
  return touched[field] && errors[field] ? errors[field].message : undefined;
}

/**
 * Check if a field has an error
 *
 * @param field - Field name
 * @param errors - Form errors object
 * @param touched - Form touched object
 * @returns True if field has error
 */
export function hasFieldError(
  field: string,
  errors: FormErrors,
  touched: FormTouched
): boolean {
  return Boolean(touched[field] && errors[field]);
}

/**
 * Mark all form fields as touched
 *
 * @param formData - Form data object
 * @returns FormTouched object with all fields set to true
 *
 * @example
 * ```typescript
 * // On form submit, mark all fields as touched
 * const touched = markAllTouched(formData);
 * setTouched(touched);
 * ```
 */
export function markAllTouched<T extends Record<string, any>>(
  formData: T
): FormTouched {
  const touched: FormTouched = {};
  Object.keys(formData).forEach((key) => {
    touched[key] = true;
  });
  return touched;
}

// ============================================================================
// SLUG UTILITIES
// ============================================================================

/**
 * Slugify a string (convert to URL-friendly format)
 *
 * @param text - Text to slugify
 * @returns Slugified text
 *
 * @example
 * ```typescript
 * slugify("Forum Génie Entreprise 2025")
 * // => "forum-genie-entreprise-2025"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

/**
 * Generate unique slug by appending a number if needed
 *
 * @param baseSlug - Base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 *
 * @example
 * ```typescript
 * const slug = generateUniqueSlug("forum-2025", ["forum-2025", "forum-2025-2"]);
 * // => "forum-2025-3"
 * ```
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  let slug = baseSlug;
  let counter = 2;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * URL validation regex
 */
export const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * Validate if a string is a valid URL
 *
 * @param url - URL to validate
 * @returns True if valid URL
 *
 * @example
 * ```typescript
 * isValidUrl("https://example.com") // => true
 * isValidUrl("not-a-url") // => false
 * ```
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty URLs are considered valid (optional fields)
  return URL_REGEX.test(url);
}

/**
 * Zod URL validator (for optional URL fields)
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   website: z.string().optional().refine(...urlValidator),
 * });
 * ```
 */
export const urlValidator = {
  validator: (val: string | undefined) => !val || isValidUrl(val),
  message: "URL invalide",
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Validate if a date string is valid
 *
 * @param dateString - Date string to validate
 * @returns True if valid date
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Compare two dates
 *
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns True if start date is before or equal to end date
 */
export function isDateRangeValid(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return true;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }

  return start <= end;
}

/**
 * Convert datetime-local input to ISO string
 *
 * @param datetimeLocal - Datetime-local string (YYYY-MM-DDTHH:mm)
 * @returns ISO date string
 */
export function datetimeLocalToISO(datetimeLocal: string): string {
  if (!datetimeLocal) return "";
  const date = new Date(datetimeLocal);
  return date.toISOString();
}

/**
 * Convert ISO string to datetime-local format
 *
 * @param isoString - ISO date string
 * @returns Datetime-local string (YYYY-MM-DDTHH:mm)
 */
export function isoToDatetimeLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Format: YYYY-MM-DDTHH:mm
  return date.toISOString().slice(0, 16);
}

// ============================================================================
// SELECT FIELD UTILITIES
// ============================================================================

/**
 * Convert boolean to select value string
 *
 * @param value - Boolean value
 * @returns "true" or "false" string
 */
export function booleanToSelectValue(value: boolean): string {
  return value ? "true" : "false";
}

/**
 * Convert select value string to boolean
 *
 * @param value - String value from select
 * @returns Boolean value
 */
export function selectValueToBoolean(value: string): boolean {
  return value === "true";
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Parse string to number (returns null if invalid)
 *
 * @param value - String value
 * @returns Number or null
 *
 * @example
 * ```typescript
 * parseNumber("123") // => 123
 * parseNumber("") // => null
 * parseNumber("abc") // => null
 * ```
 */
export function parseNumber(value: string): number | null {
  if (!value || value.trim() === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Parse string to positive integer (returns null if invalid or negative)
 *
 * @param value - String value
 * @returns Positive integer or null
 */
export function parsePositiveInt(value: string): number | null {
  const num = parseNumber(value);
  if (num === null || num < 0 || !Number.isInteger(num)) return null;
  return num;
}

// ============================================================================
// FORM SUBMISSION HELPERS
// ============================================================================

/**
 * Format validation errors for toast notification
 *
 * @param errors - Form errors object
 * @param maxErrors - Maximum number of errors to show (default: 4)
 * @returns Array of error messages
 *
 * @example
 * ```typescript
 * const messages = formatErrorsForToast(errors);
 * toast.error(
 *   <ul>
 *     {messages.map((msg, i) => <li key={i}>{msg}</li>)}
 *   </ul>
 * );
 * ```
 */
export function formatErrorsForToast(
  errors: FormErrors,
  maxErrors: number = 4
): string[] {
  const errorMessages = Object.values(errors).map((e) => e.message);
  const displayMessages = errorMessages.slice(0, maxErrors);

  if (errorMessages.length > maxErrors) {
    displayMessages.push(
      `...et ${errorMessages.length - maxErrors} autres erreurs.`
    );
  }

  return displayMessages;
}

/**
 * Check if form has any errors
 *
 * @param errors - Form errors object
 * @returns True if form has errors
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ============================================================================
// FIELD CHANGE HANDLERS
// ============================================================================

/**
 * Create a field change handler that validates on change
 *
 * @param field - Field name
 * @param setForm - Form state setter
 * @param setErrors - Errors state setter
 * @param setTouched - Touched state setter
 * @param validateFn - Validation function
 * @returns Change handler function
 *
 * @example
 * ```typescript
 * const handleTitleChange = createFieldChangeHandler(
 *   "title",
 *   setForm,
 *   setErrors,
 *   setTouched,
 *   (formData) => validateWithZod(schema, formData)
 * );
 *
 * <input onChange={(e) => handleTitleChange(e.target.value)} />
 * ```
 */
export function createFieldChangeHandler<T extends Record<string, any>>(
  field: string,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  setTouched: React.Dispatch<React.SetStateAction<FormTouched>>,
  validateFn: (data: T) => FormErrors
): (value: any) => void {
  return (value: any) => {
    // Update form
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      // Validate and update errors
      const newErrors = validateFn(updated);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: newErrors[field],
      }));

      return updated;
    });

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
}

// ============================================================================
// MARKDOWN FIELD HELPERS
// ============================================================================

/**
 * Validate markdown field length
 *
 * @param value - Markdown content
 * @param maxLength - Maximum length
 * @returns True if valid
 */
export function isMarkdownValid(
  value: string | undefined,
  maxLength: number
): boolean {
  if (!value) return true;
  return value.trim().length <= maxLength;
}

// ============================================================================
// FORM STATE RESET
// ============================================================================

/**
 * Reset form state to initial values
 *
 * @param initialValues - Initial form values
 * @param setForm - Form state setter
 * @param setErrors - Errors state setter
 * @param setTouched - Touched state setter
 *
 * @example
 * ```typescript
 * resetFormState(initialForm, setForm, setErrors, setTouched);
 * ```
 */
export function resetFormState<T extends Record<string, any>>(
  initialValues: T,
  setForm: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  setTouched: React.Dispatch<React.SetStateAction<FormTouched>>
): void {
  setForm({ ...initialValues });
  setErrors({});
  setTouched({});
}
