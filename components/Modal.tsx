"use client";
import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "full" | "large" | "medium"; // Options de taille
};

export default function Modal({ 
  open, 
  title, 
  onClose, 
  children, 
  size = "large" 
}: ModalProps) {
  if (!open) return null;

  const sizeClasses = {
    full: "w-full h-full max-h-screen mx-0",
    large: "w-full h-5/6 max-w-6xl mx-4",
    medium: "w-full h-4/5 max-w-4xl mx-4"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-lg border shadow-xl flex flex-col ${sizeClasses[size]} p-8`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900 text-2xl p-1 hover:bg-gray-100 rounded transition-colors w-8 h-8 flex items-center justify-center"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        
        {/* Content - prend tout l'espace disponible */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}