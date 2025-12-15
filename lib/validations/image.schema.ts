import { z } from "zod";

export const uploadImageSchema = z.object({
  file: z.instanceof(File),
  subdir: z.string().optional(),
});

export const uploadImagesSchema = z.object({
  files: z.array(z.instanceof(File)),
  subdir: z.string().optional(),
});

export const deleteImageSchema = z.object({
  url: z.string().url(),
});

export const deleteImagesSchema = z.object({
  urls: z.array(z.string().url()),
});

export const deleteEntityImagesSchema = z.object({
  entityType: z.enum(["event", "blogPost", "jobOffer"]),
  entityId: z.number().int().positive(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type UploadImagesInput = z.infer<typeof uploadImagesSchema>;
export type DeleteImageInput = z.infer<typeof deleteImageSchema>;
export type DeleteImagesInput = z.infer<typeof deleteImagesSchema>;
export type DeleteEntityImagesInput = z.infer<typeof deleteEntityImagesSchema>;
