import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  description,
  required,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Helper components pour inputs communs
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg px-4 py-2.5 transition-colors',
          error
            ? 'border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
            : 'border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg px-4 py-2.5 transition-colors resize-y',
          error
            ? 'border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
            : 'border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg px-4 py-2.5 transition-colors',
          error
            ? 'border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
            : 'border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
