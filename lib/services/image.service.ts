import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export interface UploadImageResult {
  url: string;
  path: string;
  filename: string;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
};

/**
 * Service de gestion des uploads d'images
 */

export class ImageService {
  private uploadDir: string;
  private publicPath: string;

  constructor(uploadDir: string = "uploads", publicPath: string = "/uploads") {
    this.uploadDir = path.join(process.cwd(), "public", uploadDir);
    this.publicPath = publicPath;
  }

  /**
   * S'assure que le répertoire d'upload existe
   */
  private async ensureUploadDir(subdir?: string): Promise<string> {
    const targetDir = subdir ? path.join(this.uploadDir, subdir) : this.uploadDir;
    try {
      await fs.access(targetDir);
    } catch {
      await fs.mkdir(targetDir, { recursive: true });
    }
    return targetDir;
  }

  /**
   * Valide le fichier uploadé
   */
  private validateFile(
    file: File,
    options: ImageUploadOptions = {}
  ): { valid: boolean; error?: string } {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Vérifier la taille
    if (file.size > opts.maxSize) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${opts.maxSize / 1024 / 1024}MB`,
      };
    }

    // Vérifier le type MIME
    if (!opts.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${opts.allowedTypes.join(", ")}`,
      };
    }

    return { valid: true };
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const uuid = uuidv4();
    return `${uuid}${ext}`;
  }

  /**
   * Upload une image
   * @param file - Le fichier à uploader
   * @param subdir - Sous-répertoire optionnel (ex: "events", "blog", "jobs")
   * @param options - Options d'upload
   */
  async uploadImage(
    file: File,
    subdir?: string,
    options?: ImageUploadOptions
  ): Promise<UploadImageResult> {
    // Valider le fichier
    const validation = this.validateFile(file, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // S'assurer que le répertoire existe
    const targetDir = await this.ensureUploadDir(subdir);

    // Générer un nom de fichier unique
    const filename = this.generateFilename(file.name);
    const filepath = path.join(targetDir, filename);

    // Sauvegarder le fichier
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    // Construire l'URL publique
    const url = subdir
      ? `${this.publicPath}/${subdir}/${filename}`
      : `${this.publicPath}/${filename}`;

    return {
      url,
      path: filepath,
      filename,
    };
  }

  /**
   * Upload plusieurs images
   */
  async uploadImages(
    files: File[],
    subdir?: string,
    options?: ImageUploadOptions
  ): Promise<UploadImageResult[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadImage(file, subdir, options))
    );
    return results;
  }

  /**
   * Supprime une image
   * @param imageUrl - L'URL de l'image à supprimer (ex: /uploads/events/xxx.jpg)
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith(this.publicPath)) {
      return; // Ignorer les URLs externes
    }

    // Extraire le chemin relatif
    const relativePath = imageUrl.replace(this.publicPath, "");
    const filepath = path.join(this.uploadDir, relativePath);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      // Ignorer si le fichier n'existe pas
      console.warn(`Could not delete image: ${filepath}`, error);
    }
  }

  /**
   * Supprime plusieurs images
   */
  async deleteImages(imageUrls: string[]): Promise<void> {
    await Promise.allSettled(imageUrls.map((url) => this.deleteImage(url)));
  }

  /**
   * Supprime toutes les images d'un sous-répertoire
   * @param subdir - Le sous-répertoire à vider
   */
  async deleteDirectory(subdir: string): Promise<void> {
    const targetDir = path.join(this.uploadDir, subdir);
    try {
      const files = await fs.readdir(targetDir);
      await Promise.allSettled(
        files.map((file) => fs.unlink(path.join(targetDir, file)))
      );
    } catch (error) {
      console.warn(`Could not delete directory: ${targetDir}`, error);
    }
  }

  /**
   * Déplace une image d'un répertoire à un autre
   */
  async moveImage(
    currentUrl: string,
    targetSubdir: string
  ): Promise<string> {
    if (!currentUrl || !currentUrl.startsWith(this.publicPath)) {
      return currentUrl; // Ne pas déplacer les URLs externes
    }

    // Extraire le nom de fichier
    const filename = path.basename(currentUrl);

    // Chemin actuel
    const relativePath = currentUrl.replace(this.publicPath, "");
    const currentPath = path.join(this.uploadDir, relativePath);

    // Nouveau chemin
    const targetDir = await this.ensureUploadDir(targetSubdir);
    const targetPath = path.join(targetDir, filename);

    try {
      await fs.rename(currentPath, targetPath);
      return `${this.publicPath}/${targetSubdir}/${filename}`;
    } catch (error) {
      console.warn(`Could not move image: ${currentPath} to ${targetPath}`, error);
      return currentUrl;
    }
  }
}

// Instance singleton du service
export const imageService = new ImageService();
