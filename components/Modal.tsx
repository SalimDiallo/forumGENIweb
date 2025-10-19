"use client";
import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "full" | "large" | "medium";
};

// Improved width and max-width handling for sizes, with better responsiveness
const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  full: "w-[100vw] max-h-screen max-w-screen m-0 sm:rounded-none",
  large:
    "w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl h-[80vh] sm:h-[85vh] mx-2 sm:mx-6",
  medium:
    "w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-[60vh] sm:h-[70vh] mx-2 sm:mx-6",
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = "full",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={`flex flex-col p-0 ${sizeClasses[size]}`}
      >
        <DialogHeader className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0 bg-white sticky top-0 z-10">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogClose
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl p-1 hover:bg-gray-100 rounded transition-colors w-8 h-8 flex items-center justify-center"
            aria-label="Fermer la boîte de dialogue"
          >
            <span aria-hidden="true">✕</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-8 py-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}