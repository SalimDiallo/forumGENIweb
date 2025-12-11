/**
 * useForm - Custom hook for form management
 *
 * This hook provides a complete form management solution with:
 * - Form state management
 * - Validation with Zod
 * - Field-level and form-level validation
 * - Error handling
 * - Touched fields tracking
 * - Form submission handling
 */

import { useState, useCallback } from "react";
import { z } from "zod";
import {
  FormErrors,
  FormTouched,
  validateWithZod,
  getFieldError,
  hasFieldError,
  markAllTouched,
  hasFormErrors,
  resetFormState,
  zodErrorsToFormErrors,
} from "@/lib/form-utils";

/**
 * useForm hook options
 */
export interface UseFormOptions<T> {
  /** Initial form values */
  initialValues: T;
  /** Zod validation schema */
  validationSchema?: z.ZodSchema<T>;
  /** Custom validation function */
  customValidation?: (values: T) => FormErrors;
  /** Validate on change (default: true) */
  validateOnChange?: boolean;
  /** Validate on blur (default: false) */
  validateOnBlur?: boolean;
}

/**
 * useForm hook return type
 */
export interface UseFormReturn<T> {
  /** Current form values */
  values: T;
  /** Form errors */
  errors: FormErrors;
  /** Touched fields */
  touched: FormTouched;
  /** Is form submitting */
  isSubmitting: boolean;
  /** Set a single field value */
  setFieldValue: (field: keyof T, value: any) => void;
  /** Set multiple field values */
  setValues: (values: Partial<T>) => void;
  /** Set field as touched */
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  /** Set field error */
  setFieldError: (field: keyof T, error: string) => void;
  /** Get error message for field */
  getError: (field: keyof T) => string | undefined;
  /** Check if field has error */
  hasError: (field: keyof T) => boolean;
  /** Validate entire form */
  validateForm: () => FormErrors;
  /** Validate single field */
  validateField: (field: keyof T) => void;
  /** Handle form submission */
  handleSubmit: (
    onSubmit: (values: T) => Promise<void> | void
  ) => (e: React.FormEvent) => Promise<void>;
  /** Reset form to initial values */
  resetForm: () => void;
  /** Check if form is valid */
  isValid: boolean;
  /** Check if form is dirty (has changes) */
  isDirty: boolean;
}

/**
 * Custom hook for form management
 *
 * @param options - Form options
 * @returns Form state and handlers
 *
 * @example
 * ```typescript
 * const form = useForm({
 *   initialValues: { email: "", password: "" },
 *   validationSchema: loginSchema,
 * });
 *
 * <input
 *   value={form.values.email}
 *   onChange={(e) => form.setFieldValue("email", e.target.value)}
 *   onBlur={() => form.setFieldTouched("email")}
 * />
 * {form.getError("email") && <span>{form.getError("email")}</span>}
 * ```
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  customValidation,
  validateOnChange = true,
  validateOnBlur = false,
}: UseFormOptions<T>): UseFormReturn<T> {
  // State
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is dirty
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  // Validate form
  const validateForm = useCallback((): FormErrors => {
    let formErrors: FormErrors = {};

    // Zod validation
    if (validationSchema) {
      formErrors = validateWithZod(validationSchema, values);
    }

    // Custom validation
    if (customValidation) {
      const customErrors = customValidation(values);
      formErrors = { ...formErrors, ...customErrors };
    }

    return formErrors;
  }, [values, validationSchema, customValidation]);

  // Check if form is valid
  const isValid = !hasFormErrors(validateForm());

  // Validate single field
  const validateField = useCallback(
    (field: keyof T) => {
      if (!validationSchema) return;

      const result = validationSchema.safeParse(values);
      if (!result.success) {
        const fieldErrors = zodErrorsToFormErrors(result.error);
        if (fieldErrors[field as string]) {
          setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field as string],
          }));
        } else {
          // Clear error if field is now valid
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
          });
        }
      } else {
        // Clear error if valid
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [values, validationSchema]
  );

  // Set field value
  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [field]: value };
        return newValues;
      });

      // Mark field as touched
      setTouched((prev) => ({ ...prev, [field as string]: true }));

      // Validate on change
      if (validateOnChange) {
        setTimeout(() => validateField(field), 0);
      }
    },
    [validateOnChange, validateField]
  );

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field as string]: isTouched }));

    // Validate on blur
    if (validateOnBlur && isTouched) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnBlur, validateField]);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: { field: field as string, message: error },
    }));
  }, []);

  // Get error for field
  const getError = useCallback(
    (field: keyof T) => {
      return getFieldError(field as string, errors, touched);
    },
    [errors, touched]
  );

  // Check if field has error
  const hasError = useCallback(
    (field: keyof T) => {
      return hasFieldError(field as string, errors, touched);
    },
    [errors, touched]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched(markAllTouched(values));

        // Validate form
        const formErrors = validateForm();
        setErrors(formErrors);

        // If form has errors, don't submit
        if (hasFormErrors(formErrors)) {
          return;
        }

        // Submit form
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validateForm]
  );

  // Reset form
  const resetForm = useCallback(() => {
    resetFormState(initialValues, setValues, setErrors, setTouched);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setValues,
    setFieldTouched,
    setFieldError,
    getError,
    hasError,
    validateForm,
    validateField,
    handleSubmit,
    resetForm,
    isValid,
    isDirty,
  };
}
