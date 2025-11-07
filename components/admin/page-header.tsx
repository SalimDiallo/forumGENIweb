import React from 'react';
import Link from 'next/link';
import { LucideIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  stats?: StatCard[];
  variant?: 'default' | 'gradient';
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  stats,
  variant = 'default',
  className,
}) => {
  const headerStyles = variant === 'gradient'
    ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white'
    : 'bg-white border border-gray-200 text-gray-900';

  const ActionIcon = action?.icon || Plus;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <section className={cn('rounded-lg p-6 shadow-sm', headerStyles)}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn(
              'text-2xl font-bold mb-2',
              variant === 'gradient' ? 'text-white' : 'text-gray-900'
            )}>
              {title}
            </h1>
            {description && (
              <p className={cn(
                'text-base',
                variant === 'gradient' ? 'text-white/90' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
          </div>
          {action && (
            action.href ? (
              <Link
                href={action.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-colors',
                  variant === 'gradient'
                    ? 'bg-white text-teal-700 hover:bg-teal-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                <ActionIcon className="w-5 h-5" />
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-5 py-3 font-medium transition-colors',
                  variant === 'gradient'
                    ? 'bg-white text-teal-700 hover:bg-teal-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                <ActionIcon className="w-5 h-5" />
                {action.label}
              </button>
            )
          )}
        </div>

        {/* Stats intégrées dans le header (pour variant gradient) */}
        {variant === 'gradient' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats séparées (pour variant default) */}
      {variant === 'default' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                  {StatIcon && <StatIcon className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
