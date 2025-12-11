import { z } from "zod";

// Helper to transform string "true"/"false" to boolean
const stringToBoolean = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true" ? true : val === "false" ? false : undefined),
]).optional();

// Helper to transform string to number
const stringToNumber = z.union([
  z.number(),
  z.string().transform((val) => val === "" ? undefined : Number(val)),
  z.nan().transform(() => undefined),
]).optional();

const baseJobOfferSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères"),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  companyLogo: z.string().optional(),
  companyWebsite: z.string().optional(),
  industry: z.string().optional(),
  jobType: z.string().optional(),
  location: z.string().optional(),
  isRemote: stringToBoolean,
  salaryMin: stringToNumber,
  salaryMax: stringToNumber,
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  applicationEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  applicationUrl: z.string().optional(),
  applicationPhone: z.string().optional(),
  applicationDeadline: z.string().optional(),
  experienceRequired: z.string().optional(),
  educationLevel: z.string().optional(),
  contractDuration: z.string().optional(),
  startDate: z.string().optional(),
  skillsRequired: z.string().optional(),
  languagesRequired: z.string().optional(),
  status: z.string().optional(),
  isFeatured: stringToBoolean,
});

export const createJobOfferSchema = baseJobOfferSchema.transform((data) => ({
  ...data,
  // Convert empty strings to undefined for optional fields
  companyLogo: data.companyLogo || undefined,
  companyWebsite: data.companyWebsite || undefined,
  industry: data.industry || undefined,
  jobType: data.jobType || undefined,
  location: data.location || undefined,
  salaryMin: isNaN(data.salaryMin as number) ? undefined : data.salaryMin,
  salaryMax: isNaN(data.salaryMax as number) ? undefined : data.salaryMax,
  salaryCurrency: data.salaryCurrency || undefined,
  salaryPeriod: data.salaryPeriod || undefined,
  description: data.description || undefined,
  requirements: data.requirements || undefined,
  benefits: data.benefits || undefined,
  applicationEmail: data.applicationEmail || undefined,
  applicationUrl: data.applicationUrl || undefined,
  applicationPhone: data.applicationPhone || undefined,
  applicationDeadline: data.applicationDeadline || undefined,
  experienceRequired: data.experienceRequired || undefined,
  educationLevel: data.educationLevel || undefined,
  contractDuration: data.contractDuration || undefined,
  startDate: data.startDate || undefined,
  skillsRequired: data.skillsRequired || undefined,
  languagesRequired: data.languagesRequired || undefined,
  status: data.status || undefined,
}));

export const updateJobOfferSchema = baseJobOfferSchema.partial().extend({
  id: z.number().int().positive(),
}).transform((data) => ({
  ...data,
  // Convert empty strings to undefined for optional fields
  companyLogo: data.companyLogo || undefined,
  companyWebsite: data.companyWebsite || undefined,
  industry: data.industry || undefined,
  jobType: data.jobType || undefined,
  location: data.location || undefined,
  salaryMin: isNaN(data.salaryMin as number) ? undefined : data.salaryMin,
  salaryMax: isNaN(data.salaryMax as number) ? undefined : data.salaryMax,
  salaryCurrency: data.salaryCurrency || undefined,
  salaryPeriod: data.salaryPeriod || undefined,
  description: data.description || undefined,
  requirements: data.requirements || undefined,
  benefits: data.benefits || undefined,
  applicationEmail: data.applicationEmail || undefined,
  applicationUrl: data.applicationUrl || undefined,
  applicationPhone: data.applicationPhone || undefined,
  applicationDeadline: data.applicationDeadline || undefined,
  experienceRequired: data.experienceRequired || undefined,
  educationLevel: data.educationLevel || undefined,
  contractDuration: data.contractDuration || undefined,
  startDate: data.startDate || undefined,
  skillsRequired: data.skillsRequired || undefined,
  languagesRequired: data.languagesRequired || undefined,
  status: data.status || undefined,
}));

export type CreateJobOfferInput = z.infer<typeof createJobOfferSchema>;
export type UpdateJobOfferInput = z.infer<typeof updateJobOfferSchema>;


