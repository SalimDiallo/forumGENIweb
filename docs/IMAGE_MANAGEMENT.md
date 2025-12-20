# Système de Gestion d'Images

Ce document décrit le système de gestion d'images mis en place pour l'application Forum GENIEntreprise.

## Vue d'ensemble

Le système gère automatiquement l'upload, le stockage et la suppression des images pour les entités suivantes :
- **Events** (Événements)
- **Blog Posts** (Articles de blog)
- **Job Offers** (Offres d'emploi)

### Caractéristiques principales

- ✅ Upload d'images avec validation (taille, type MIME)
- ✅ Génération automatique de noms de fichiers uniques (UUID)
- ✅ Organisation par sous-répertoires (events, blog, jobs)
- ✅ Suppression automatique des images lors de la suppression des entités
- ✅ Support de plusieurs images par entité
- ✅ Gestion de l'image de couverture (pour les events)

## Architecture

### Structure des fichiers

```
/lib
  /services
    image.service.ts       # Service principal de gestion d'images
  /validations
    image.schema.ts        # Schémas de validation Zod

/app/admin
  /images
    image.actions.ts       # Actions serveur pour l'upload/suppression

/public
  /uploads                 # Répertoire de stockage des images
    /events               # Images des événements
    /blog                 # Images des articles de blog
    /jobs                 # Images des offres d'emploi
```

### Modèles de base de données

#### EventImage
```prisma
model EventImage {
  id        Int      @id @default(autoincrement())
  eventId   Int
  url       String
  isCover   Boolean  @default(false)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}
```

#### BlogPostImage
```prisma
model BlogPostImage {
  id        Int      @id @default(autoincrement())
  postId    Int
  url       String
  caption   String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  post      BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

#### JobOfferImage
```prisma
model JobOfferImage {
  id        Int      @id @default(autoincrement())
  jobId     Int
  url       String
  caption   String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  job       JobOffer @relation(fields: [jobId], references: [id], onDelete: Cascade)
}
```

## Workflow complet

### Création d'une entité avec images

1. **L'utilisateur sélectionne des fichiers** dans le formulaire
2. **Upload des images** via l'action d'upload spécifique (uploadEventImages, uploadBlogImages, uploadJobImages)
3. **Les URLs sont stockées** temporairement dans le state du formulaire
4. **Soumission du formulaire** avec les URLs d'images
5. **Création de l'entité** avec les enregistrements d'images en base

### Édition d'une entité avec images

1. **Chargement des images existantes** depuis la base
2. **L'utilisateur peut ajouter/retirer** des images
3. **Upload des nouvelles images** via l'action d'upload
4. **Soumission du formulaire** avec les nouvelles URLs
5. **Suppression des anciennes images physiques** du système de fichiers
6. **Mise à jour des enregistrements** en base (suppression + création)

### Suppression d'une entité

1. **Récupération de l'entité** avec ses images
2. **Suppression des fichiers physiques** du système de fichiers
3. **Suppression de l'entité** (cascade automatique pour les enregistrements)

## Utilisation

### Actions d'upload par entité

#### Events

```typescript
import { uploadEventImages, deleteTemporaryEventImage } from "@/app/admin/events/event.image.action";

// Upload des images
const result = await uploadEventImages({ files: [file1, file2] });
// Résultat : { ok: true, images: [{ url, filename }, ...] }

// Supprimer une image temporaire
await deleteTemporaryEventImage({ url: "/uploads/events/uuid.jpg" });
```

#### Blog Posts

```typescript
import { uploadBlogImages, deleteTemporaryBlogImage } from "@/app/admin/blog/blog.image.action";

// Upload des images
const result = await uploadBlogImages({ files: [file1, file2] });

// Supprimer une image temporaire
await deleteTemporaryBlogImage({ url: "/uploads/blog/uuid.jpg" });
```

#### Job Offers

```typescript
import { uploadJobImages, deleteTemporaryJobImage } from "@/app/admin/jobs/job.image.action";

// Upload des images
const result = await uploadJobImages({ files: [file1, file2] });

// Supprimer une image temporaire
await deleteTemporaryJobImage({ url: "/uploads/jobs/uuid.jpg" });
```

### Service ImageService

#### Upload d'une image

```typescript
import { imageService } from "@/lib/services/image.service";

// Upload simple
const result = await imageService.uploadImage(file, "events");
// Résultat : { url: "/uploads/events/uuid.jpg", path: "...", filename: "uuid.jpg" }

// Upload avec options
const result = await imageService.uploadImage(file, "blog", {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png"],
});
```

#### Upload de plusieurs images

```typescript
const results = await imageService.uploadImages(files, "events");
// Résultat : Array<{ url, path, filename }>
```

#### Suppression d'images

```typescript
// Supprimer une image
await imageService.deleteImage("/uploads/events/uuid.jpg");

// Supprimer plusieurs images
await imageService.deleteImages([
  "/uploads/events/uuid1.jpg",
  "/uploads/events/uuid2.jpg",
]);

// Supprimer tout un répertoire
await imageService.deleteDirectory("events");
```

#### Déplacer une image

```typescript
const newUrl = await imageService.moveImage(
  "/uploads/temp/uuid.jpg",
  "events"
);
// Résultat : "/uploads/events/uuid.jpg"
```

### Actions serveur

#### Upload d'images

```typescript
import { uploadImage, uploadImages } from "@/app/admin/images/image.actions";

// Upload une image
const result = await uploadImage({ file, subdir: "events" });

// Upload plusieurs images
const result = await uploadImages({ files, subdir: "blog" });
```

#### Suppression d'images d'une entité

```typescript
import { deleteEntityImages } from "@/app/admin/images/image.actions";

// Supprimer toutes les images d'un event
await deleteEntityImages({
  entityType: "event",
  entityId: 123,
});

// Supprimer toutes les images d'un article de blog
await deleteEntityImages({
  entityType: "blogPost",
  entityId: 456,
});

// Supprimer toutes les images d'une offre d'emploi
await deleteEntityImages({
  entityType: "jobOffer",
  entityId: 789,
});
```

### Intégration avec les actions de suppression

Les actions de suppression des entités suppriment automatiquement leurs images :

#### Events

```typescript
// app/admin/events/event.delete.action.ts
export const deleteEvent = deleteAction
  .metadata({ actionName: "delete-event" })
  .schema(deleteEventSchema)
  .action(async ({ parsedInput }) => {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { images: true },
    });

    // Supprimer les fichiers physiques
    await imageService.deleteImages(event.images.map(img => img.url));

    // Supprimer l'entité (cascade automatique pour les enregistrements)
    await prisma.event.delete({ where: { id } });
  });
```

#### Blog Posts

```typescript
// app/admin/blog/posts-actions.ts
export const deleteBlogPost = deleteAction
  .action(async ({ parsedInput }) => {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { images: true },
    });

    await imageService.deleteImages(post.images.map(img => img.url));
    await prisma.blogPost.delete({ where: { id } });
  });
```

#### Job Offers

```typescript
// app/admin/jobs/actions.ts
export const deleteJob = deleteAction
  .action(async ({ parsedInput }) => {
    const job = await prisma.jobOffer.findUnique({
      where: { id },
      include: { images: true },
    });

    await imageService.deleteImages(job.images.map(img => img.url));
    await prisma.jobOffer.delete({ where: { id } });
  });
```

## Configuration

### Options par défaut

```typescript
const DEFAULT_OPTIONS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
};
```

### Personnalisation

Vous pouvez personnaliser les options lors de l'upload :

```typescript
await imageService.uploadImage(file, "events", {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/png", "image/webp"],
});
```

## Sécurité

1. **Validation du type MIME** : Seuls les types d'images autorisés sont acceptés
2. **Limitation de taille** : Taille maximale par défaut de 5MB
3. **Noms de fichiers uniques** : Utilisation d'UUID pour éviter les conflits
4. **Isolation par sous-répertoires** : Organisation des images par type d'entité

## Bonnes pratiques

1. **Toujours valider côté client et serveur** : Vérifier le type et la taille avant l'upload
2. **Gérer les erreurs** : Capturer les erreurs d'upload et afficher des messages appropriés
3. **Nettoyer les images orphelines** : Supprimer les images non utilisées régulièrement
4. **Optimiser les images** : Compresser les images avant l'upload si possible
5. **Utiliser des sous-répertoires** : Organiser les images par type d'entité

## Maintenance

### Nettoyage des images orphelines

Créer un script de maintenance pour supprimer les images non référencées :

```typescript
// scripts/clean-orphaned-images.ts
import { imageService } from "@/lib/services/image.service";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

async function cleanOrphanedImages() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Récupérer toutes les URLs d'images en base
  const eventImages = await prisma.eventImage.findMany({ select: { url: true } });
  const blogImages = await prisma.blogPostImage.findMany({ select: { url: true } });
  const jobImages = await prisma.jobOfferImage.findMany({ select: { url: true } });

  const usedUrls = new Set([
    ...eventImages.map(img => img.url),
    ...blogImages.map(img => img.url),
    ...jobImages.map(img => img.url),
  ]);

  // Parcourir les fichiers et supprimer les orphelins
  const subdirs = ["events", "blog", "jobs"];
  for (const subdir of subdirs) {
    const dir = path.join(uploadDir, subdir);
    const files = await fs.readdir(dir);

    for (const file of files) {
      const url = `/uploads/${subdir}/${file}`;
      if (!usedUrls.has(url)) {
        await imageService.deleteImage(url);
        console.log(`Supprimé : ${url}`);
      }
    }
  }
}
```

## Migration

Pour ajouter le support d'images à une nouvelle entité :

1. **Ajouter le modèle dans Prisma**
```prisma
model MyEntityImage {
  id        Int      @id @default(autoincrement())
  entityId  Int
  url       String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  entity    MyEntity @relation(fields: [entityId], references: [id], onDelete: Cascade)

  @@index([entityId])
  @@map("my_entity_images")
}
```

2. **Ajouter la relation dans l'entité**
```prisma
model MyEntity {
  // ...
  images MyEntityImage[]
}
```

3. **Créer la migration**
```bash
npx prisma migrate dev --name add_my_entity_images
```

4. **Modifier l'action de suppression**
```typescript
export const deleteMyEntity = deleteAction
  .action(async ({ parsedInput }) => {
    const entity = await prisma.myEntity.findUnique({
      where: { id },
      include: { images: true },
    });

    await imageService.deleteImages(entity.images.map(img => img.url));
    await prisma.myEntity.delete({ where: { id } });
  });
```

5. **Ajouter le type dans `deleteEntityImages`**
```typescript
// lib/validations/image.schema.ts
export const deleteEntityImagesSchema = z.object({
  entityType: z.enum(["event", "blogPost", "jobOffer", "myEntity"]),
  entityId: z.number().int().positive(),
});
```

## Troubleshooting

### L'image n'est pas supprimée

Vérifiez que :
- Le chemin de l'image commence par `/uploads`
- Le fichier existe sur le système de fichiers
- Les permissions du répertoire `public/uploads` sont correctes

### Erreur lors de l'upload

Vérifiez que :
- Le répertoire `public/uploads` existe
- Les permissions d'écriture sont correctes
- La taille du fichier ne dépasse pas la limite
- Le type MIME est autorisé

### Images orphelines

Exécutez le script de nettoyage régulièrement pour supprimer les images non utilisées.
