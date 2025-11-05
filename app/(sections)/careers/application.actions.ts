"use server";
import { actionClient } from "@/lib/safe-action";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Schema for job application
const jobApplicationSchema = z.object({
  jobOfferId: z.number().int().positive(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  resumeUrl: z.string().url("URL de CV invalide").optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  skills: z.string().optional(), // Comma-separated skills
  portfolioUrl: z.string().url("URL de portfolio invalide").optional().or(z.literal("")),
  linkedinUrl: z.string().url("URL LinkedIn invalide").optional().or(z.literal("")),
  availability: z.string().optional(),
  expectedSalary: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const submitJobApplication = actionClient
  .metadata({ actionName: "submit-job-application" })
  .schema(jobApplicationSchema)
  .action(async ({ parsedInput }) => {
    // Check if job offer exists and is published
    const jobOffer = await prisma.jobOffer.findFirst({
      where: {
        id: parsedInput.jobOfferId,
        status: "published",
      },
    });

    if (!jobOffer) {
      throw new Error("Cette offre d'emploi n'existe pas ou n'est plus disponible.");
    }

    // Check if user already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobOfferId: parsedInput.jobOfferId,
        email: parsedInput.email,
      },
    });

    if (existingApplication) {
      throw new Error("Vous avez déjà postulé à cette offre d'emploi.");
    }

    // Create the application
    const application = await prisma.jobApplication.create({
      data: {
        ...parsedInput,
        // Clean up empty strings
        resumeUrl: parsedInput.resumeUrl || undefined,
        portfolioUrl: parsedInput.portfolioUrl || undefined,
        linkedinUrl: parsedInput.linkedinUrl || undefined,
        // Add metadata if available
      },
    });

    // Increment views count for the job offer
    await prisma.jobOffer.update({
      where: { id: parsedInput.jobOfferId },
      data: { viewsCount: { increment: 1 } },
    });

    return {
      id: application.id,
      message: "Votre candidature a été envoyée avec succès !",
    };
  });

// Get applications for a specific job (admin use)
const getApplicationsSchema = z.object({
  jobOfferId: z.number().int().positive(),
  status: z.string().optional(),
  limit: z.number().int().positive().default(20),
  offset: z.number().int().min(0).default(0),
});

export const getJobApplications = actionClient
  .metadata({ actionName: "get-job-applications" })
  .schema(getApplicationsSchema)
  .action(async ({ parsedInput }) => {
    const { jobOfferId, status, limit, offset } = parsedInput;

    const where = {
      jobOfferId,
      ...(status && { status }),
    };

    const [applications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { appliedAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          resumeUrl: true,
          coverLetter: true,
          experience: true,
          education: true,
          skills: true,
          portfolioUrl: true,
          linkedinUrl: true,
          availability: true,
          expectedSalary: true,
          additionalInfo: true,
          status: true,
          appliedAt: true,
          reviewedAt: true,
          notes: true,
        },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return {
      applications,
      totalCount,
      hasMore: offset + limit < totalCount,
    };
  });

// Update application status (admin use)
const updateApplicationStatusSchema = z.object({
  applicationId: z.number().int().positive(),
  status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
  notes: z.string().optional(),
});

export const updateApplicationStatus = actionClient
  .metadata({ actionName: "update-application-status" })
  .schema(updateApplicationStatusSchema)
  .action(async ({ parsedInput }) => {
    const { applicationId, status, notes } = parsedInput;

    const application = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
      },
    });

    return {
      id: application.id,
      message: "Statut de la candidature mis à jour avec succès.",
    };
  });
