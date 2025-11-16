"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for getting job by slug
const getJobBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const getJobBySlug = actionClient
  .metadata({ actionName: "get-job-by-slug" })
  .schema(getJobBySlugSchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput;

    const job = await prisma.jobOffer.findUnique({
      where: {
        slug,
        status: "published",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        companyName: true,
        companyLogo: true,
        companyWebsite: true,
        industry: true,
        jobType: true,
        location: true,
        isRemote: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        salaryPeriod: true,
        description: true,
        requirements: true,
        benefits: true,
        applicationEmail: true,
        applicationUrl: true,
        applicationPhone: true,
        applicationDeadline: true,
        experienceRequired: true,
        educationLevel: true,
        contractDuration: true,
        startDate: true,
        skillsRequired: true,
        languagesRequired: true,
        isFeatured: true,
        viewsCount: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!job) {
      throw new Error("Offre d'emploi non trouvée");
    }

    // Increment view count
    await prisma.jobOffer.update({
      where: { id: job.id },
      data: { viewsCount: { increment: 1 } },
    });

    // Transform the data for frontend
    return {
      job: {
        id: job.id,
        title: job.title,
        slug: job.slug,
        company: job.companyName,
        companyLogo: job.companyLogo || "/partners/default-logo.png",
        companyWebsite: job.companyWebsite,
        industry: job.industry,
        location: job.location || "Non spécifié",
        type: job.jobType || "autre",
        isRemote: job.isRemote || false,
        salary: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod),
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        salaryPeriod: job.salaryPeriod,
        postedDate: job.publishedAt?.toISOString() || job.createdAt.toISOString(),
        description: job.description || "Aucune description disponible.",
        requirements: parseCommaSeparated(job.requirements),
        benefits: parseCommaSeparated(job.benefits),
        skillsRequired: parseCommaSeparated(job.skillsRequired),
        languagesRequired: parseCommaSeparated(job.languagesRequired),
        experienceRequired: job.experienceRequired,
        educationLevel: job.educationLevel,
        contractDuration: job.contractDuration,
        startDate: job.startDate?.toISOString(),
        applicationEmail: job.applicationEmail,
        applicationUrl: job.applicationUrl,
        applicationPhone: job.applicationPhone,
        applicationDeadline: job.applicationDeadline?.toISOString(),
        featured: job.isFeatured || false,
        viewsCount: job.viewsCount,
      },
    };
  });

// Helper function to format salary
function formatSalary(min?: number | null, max?: number | null, currency?: string | null, period?: string | null): string {
  if (!min && !max) return "À négocier";

  const currencySymbol = currency === "MAD" ? "DH" : currency === "EUR" ? "€" : currency === "USD" ? "$" : currency || "DH";
  const periodText = period === "month" ? "/mois" : period === "year" ? "/an" : period === "day" ? "/jour" : period === "hour" ? "/h" : "";

  if (min && max) {
    return `${min.toLocaleString()}-${max.toLocaleString()} ${currencySymbol}${periodText}`;
  } else if (min) {
    return `À partir de ${min.toLocaleString()} ${currencySymbol}${periodText}`;
  } else if (max) {
    return `Jusqu'à ${max.toLocaleString()} ${currencySymbol}${periodText}`;
  }

  return "À négocier";
}

// Helper function to parse comma-separated strings
function parseCommaSeparated(str?: string | null): string[] {
  if (!str) return [];
  return str.split(",").map(s => s.trim()).filter(s => s.length > 0);
}
