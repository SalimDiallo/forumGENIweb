"use client";
import { ReactNode, useRef, useEffect } from "react";

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
  size = "large"
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = "modal-title";

  // Focus le bouton de fermeture à l'ouverture du modal
  useEffect(() => {
    if (open) {
      // Focus sur le bouton close par défaut (mais pourrait supporter focus trap)
      closeBtnRef.current?.focus();
      // Empêcher le scroll en arrière-plan
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      }
    }
  }, [open]);

  // Fermeture du modal avec la touche Escape
  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    full: "w-full h-full max-h-screen mx-0",
    large: "w-full h-5/6 max-w-6xl mx-4",
    medium: "w-full h-4/5 max-w-4xl mx-4"
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* backdrop, non-focusable, click ferme le modal */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg border shadow-xl flex flex-col ${sizeClasses[size]} p-8`}
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
            autoFocus
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