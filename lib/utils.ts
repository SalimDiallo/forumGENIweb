import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
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
