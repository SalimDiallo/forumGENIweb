"use server";

import { adminAction } from "@/lib/safe-action";
import { imageService } from "@/lib/services/image.service";
import { z } from "zod";

/**
 * Schema pour l'upload d'images de blog posts
 */
const uploadBlogImagesSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "Au moins une image est requise"),
});

/**
 * Action pour uploader des images de blog posts
 * À utiliser avant de créer/éditer un article
 */
export const uploadBlogImages = adminAction
  .metadata({ actionName: "upload-blog-images" })
  .schema(uploadBlogImagesSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { files } = parsedInput;

      // Upload toutes les images dans le sous-répertoire "blog"
      const uploadResults = await imageService.uploadImages(files, "blog");

      // Retourner les URLs pour les utiliser dans le formulaire
      return {
        ok: true,
        images: uploadResults.map((result) => ({
          url: result.url,
          filename: result.filename,
        })),
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'upload des images");
    }
  });

/**
 * Schema pour supprimer une image temporaire
 */
const deleteTemporaryImageSchema = z.object({
  url: z.string().min(1, "L'URL de l'image est requise"),
});

/**
 * Action pour supprimer une image temporaire
 * À utiliser si l'utilisateur retire une image avant de soumettre le formulaire
 */
export const deleteTemporaryBlogImage = adminAction
  .metadata({ actionName: "delete-temporary-blog-image" })
  .schema(deleteTemporaryImageSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { url } = parsedInput;

      // Supprimer l'image du système de fichiers
      await imageService.deleteImage(url);

      return {
        ok: true,
        message: "Image supprimée avec succès",
      };
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la suppression de l'image");
    }
  });
