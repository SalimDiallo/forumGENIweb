import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import JobDetailClient from './JobDetailClient';

interface JobPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: JobPageProps) {
  const { slug } = await params;

  const job = await prisma.jobOffer.findUnique({
    where: {
      slug,
      status: 'published',
    },
    select: {
      title: true,
      companyName: true,
      description: true,
      location: true,
    },
  });

  if (!job) {
    return {
      title: 'Offre non trouvée',
    };
  }

  return {
    title: `${job.title} - ${job.companyName} | Forum Génie Entreprise`,
    description: job.description ? job.description.substring(0, 160) : `Offre d'emploi ${job.title} chez ${job.companyName} à ${job.location}`,
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;

  const job = await prisma.jobOffer.findUnique({
    where: {
      slug,
      status: 'published',
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
    notFound();
  }

  // Increment view count
  // await prisma.jobOffer.update({
  //   where: { id: job.id },
  //   data: { viewsCount: { increment: 1 } },
  // });

  // Format salary
  const formatSalary = (min?: number | null, max?: number | null, currency?: string | null, period?: string | null): string => {
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
  };

  // Parse comma-separated strings
  const parseCommaSeparated = (str?: string | null): string[] => {
    if (!str) return [];
    return str.split(",").map(s => s.trim()).filter(s => s.length > 0);
  };

  const jobData = {
    id: job.id,
    title: job.title,
    slug: job.slug,
    company: job.companyName,
    companyLogo: job.companyLogo,
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
  };

  return <JobDetailClient job={jobData} />;
}
