import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', text = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-green-600 mb-4`}></div>
      {text && <p className="text-green-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loading;
