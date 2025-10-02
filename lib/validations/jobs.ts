import { z } from "zod";

export const createJobOfferSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  companyName: z.string().min(1),
  companyLogo: z.string().optional(),
  companyWebsite: z.string().optional(),
  industry: z.string().optional(),
  jobType: z.string().min(2),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default("MAD"),
  salaryPeriod: z.string().default("month"),
  description: z.string().min(1),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  applicationEmail: z.string().email().optional(),
  applicationUrl: z.string().optional(),
  applicationPhone: z.string().optional(),
  applicationDeadline: z.string().datetime().optional(),
  experienceRequired: z.string().default("none"),
  educationLevel: z.string().default("bac+3"),
  contractDuration: z.string().optional(),
  startDate: z.string().datetime().optional(),
  skillsRequired: z.string().optional(),
  languagesRequired: z.string().optional(),
  status: z.string().default("draft"),
  isFeatured: z.boolean().default(false),
});

export const updateJobOfferSchema = createJobOfferSchema.partial().extend({
  id: z.number().int().positive(),
});

export type CreateJobOfferInput = z.infer<typeof createJobOfferSchema>;
export type UpdateJobOfferInput = z.infer<typeof updateJobOfferSchema>;


