"use client";
import { ReactNode, useRef, useEffect, useState } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "full" | "large" | "medium";
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = "full"
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = "modal-title";
  const [isClient, setIsClient] = useState(false);

  // Hydration: Vérifier qu'on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Focus le bouton de fermeture à l'ouverture du modal
  useEffect(() => {
    if (!isClient || !open) return;
    
    // Focus sur le bouton close par défaut
    closeBtnRef.current?.focus();
    // Empêcher le scroll en arrière-plan
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isClient]);

  // Fermeture du modal avec la touche Escape
  useEffect(() => {
    if (!isClient || !open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      // Minimal tab trap: Focus reste dans le modal
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isClient]);

  // Ne pas rendre le portail avant hydration côté client
  if (!isClient) {
    return null;
  }

  // Rendre le DOM même si fermé pour éviter l'hydration mismatch
  // Utiliser display: none ou opacity: 0 pour cacher
  const sizeClasses = {
    full: "w-full h-full max-h-screen mx-0",
    large: "w-full h-5/6 max-w-6xl mx-4",
    medium: "w-full h-4/5 max-w-4xl mx-4"
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-8 transition-all duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-hidden={!open}
    >
      {/* backdrop, non-focusable, click ferme le modal */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg border shadow-xl flex flex-col ${sizeClasses[size]} p-8 transition-transform duration-200 ${
          open ? "scale-100" : "scale-95"
        }`}
        tabIndex={-1}
      >
        {/* Header (toujours sticky & identifiable par ID accessible) */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-semibold" id={titleId}>
            {title}
          </h3>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl p-1 hover:bg-gray-100 rounded transition-colors w-8 h-8 flex items-center justify-center"
            aria-label="Fermer la boîte de dialogue"
            autoFocus={open}
            disabled={!open}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}