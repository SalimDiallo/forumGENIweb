"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for filtering jobs
const getJobsSchema = z.object({
  search: z.string().optional(),
  jobType: z.string().optional(),
  limit: z.number().int().positive().default(20),
  offset: z.number().int().min(0).default(0),
});

export const getPublicJobs = actionClient
  .metadata({ actionName: "get-public-jobs" })
  .schema(getJobsSchema)
  .action(async ({ parsedInput }) => {
    const { search, jobType, limit, offset } = parsedInput;
    
    const where = {
      status: "published",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { companyName: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(jobType && jobType !== "all" && { jobType }),
    };

    const [jobs, totalCount] = await Promise.all([
      prisma.jobOffer.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
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
      }),
      prisma.jobOffer.count({ where }),
    ]);

    // Transform the data for frontend
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companyName,
      location: job.location || "Non spécifié",
      type: job.jobType || "autre",
      salary: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod),
      postedDate: job.publishedAt?.toISOString().split('T')[0] || job.createdAt.toISOString().split('T')[0],
      description: job.description || "Aucune description disponible.",
      requirements: parseCommaSeparated(job.requirements),
      benefits: parseCommaSeparated(job.benefits),
      skills: parseCommaSeparated(job.skillsRequired),
      logo: job.companyLogo || "/partners/default-logo.png",
      featured: job.isFeatured || false,
      urgent: isUrgent(job.applicationDeadline),
      remote: job.isRemote || false,
      rating: 4.5, // Default rating for now
      applicants: Math.floor(Math.random() * 50) + 10, // Mock data for now
      applicationEmail: job.applicationEmail,
      applicationUrl: job.applicationUrl,
      applicationPhone: job.applicationPhone,
      applicationDeadline: job.applicationDeadline?.toISOString().split('T')[0],
    }));

    return {
      jobs: transformedJobs,
      totalCount,
      hasMore: offset + limit < totalCount,
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

// Helper function to determine if job is urgent
function isUrgent(deadline?: Date | null): boolean {
  if (!deadline) return false;
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays > 0;
}
