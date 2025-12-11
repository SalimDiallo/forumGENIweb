import { clsx, type ClassValue } from "clsx"
import { AlertCircle } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const statusOptions = [
  { value: "draft", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
  { value: "published", label: "Publié", color: "bg-emerald-100 text-emerald-800" },
  { value: "ongoing", label: "En cours", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Terminé", color: "bg-purple-100 text-purple-800" },
  { value: "cancelled", label: "Annulé", color: "bg-red-100 text-red-800" },
];

export const eventTypeOptions = [
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Atelier" },
  { value: "conference", label: "Conférence" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinaire" },
  { value: "other", label: "Autre" },
];

// Utility function to generate slug from title
export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD") // Remove accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/-+/g, "-");
}
