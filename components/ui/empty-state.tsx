import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
}) => {
  const actionStyles = action?.variant === 'secondary'
    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    : 'bg-gray-900 text-white hover:bg-gray-800';

  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className={cn('w-16 h-16 text-gray-300', iconClassName)} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              actionStyles
            )}
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              actionStyles
            )}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
};
