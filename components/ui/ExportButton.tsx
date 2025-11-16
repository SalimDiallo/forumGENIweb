'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  variant?: 'icon' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  includeFormats?: ('csv' | 'json')[];
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  variant = 'icon',
  size = 'md',
  className = '',
  includeFormats = ['csv', 'json'],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exported, setExported] = useState(false);

  const sizeClasses = {
    sm: variant === 'icon' ? 'p-2 sm:p-2' : 'px-3 py-2',
    md: variant === 'icon' ? 'p-2 sm:p-2.5' : 'px-4 py-2',
    lg: variant === 'icon' ? 'p-3 sm:p-3' : 'px-5 py-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
    setIsOpen(false);
  };

  const exportAsCSV = () => {
    const csv = convertToCSV(data);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  const handleExport = () => {
    if (includeFormats.length === 1) {
      // Direct export if only one format
      if (includeFormats[0] === 'csv') {
        exportAsCSV();
      } else {
        exportAsJSON();
      }
    } else {
      // Show dropdown for multiple formats
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        className={`${sizeClasses[size]} bg-white text-gray-600 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center gap-2 ${className}`}
        aria-label="Exporter"
      >
        {exported ? (
          <Check className={`${iconSizes[size]} text-green-600`} />
        ) : (
          <Download className={iconSizes[size]} />
        )}
        {variant === 'full' && (
          <span className="text-sm font-medium">Exporter</span>
        )}
      </button>

      {isOpen && includeFormats.length > 1 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">Format d'export</h3>
            </div>

            <div className="p-2">
              {includeFormats.includes('csv') && (
                <button
                  onClick={exportAsCSV}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">CSV</p>
                    <p className="text-xs text-gray-500">Fichier Excel</p>
                  </div>
                </button>
              )}

              {includeFormats.includes('json') && (
                <button
                  onClick={exportAsJSON}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">JSON</p>
                    <p className="text-xs text-gray-500">Fichier JSON</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
