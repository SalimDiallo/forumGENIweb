# 📝 Améliorations du Formulaire CreateEventForm

## ✅ Corrections Appliquées

### 1. Syntaxe corrigée
- ✅ Supprimé les lignes en double à la fin du fichier (lignes 832-833)
- ✅ Le fichier compile maintenant correctement

---

## 🎯 Améliorations Recommandées

### 1. **Utiliser le schéma centralisé `createEventSchema`**

**❌ Problème Actuel :**
- Le formulaire définit son propre schéma Zod local (`eventSchema`) aux lignes 24-100
- Ce schéma est **dupliqué** et différent de `event.create.schema.ts`
- Risque de désynchronisation entre la validation côté client et côté serveur

**✅ Solution :**
```typescript
// Importer le schéma centralisé
import { createEventSchema } from "./event.create.schema";

// Utiliser directement le schéma pour la validation
function validate(form: any, isEditor: boolean) {
  const zodResult = createEventSchema.safeParse(form);
  // ...
}
```

**Avantages :**
- ✅ Une seule source de vérité
- ✅ Cohérence entre client et serveur
- ✅ Moins de code à maintenir

---

### 2. **Synchroniser les Types avec Prisma**

**❌ Problème Actuel :**
- Les options `eventTypeOptions` et `statusOptions` sont importées depuis `@/lib/utils`
- Pas de typage fort avec les enums Prisma
- Risque d'incohérence avec le schéma de base de données

**✅ Solution :**
```typescript
import type { EventType, EventStatus } from "@/lib/validations/events";

// Définir les options avec typage fort
const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Atelier" },
  { value: "conference", label: "Conférence" },
  { value: "networking", label: "Networking" },
  { value: "webinar", label: "Webinaire" },
  { value: "other", label: "Autre" },
];

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  { value: "ongoing", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
];
```

---

### 3. **Corriger `maxParticipants`**

**❌ Problème Actuel (ligne 121) :**
```typescript
maxParticipants: undefined,  // ❌ Type undefined
```

**✅ Selon Prisma (schema.prisma:238) :**
```prisma
maxParticipants Int? // Nullable Int
```

**✅ Solution :**
```typescript
// Dans initialForm
maxParticipants: null,  // ✅ ou undefined, mais cohérent

// Dans le handler
setField(
  "maxParticipants",
  e.target.value === "" ? null : Number(e.target.value)
);
```

---

### 4. **Simplifier la Validation**

**❌ Problème Actuel :**
- Double validation : Zod + validation custom (ligne 139-198)
- Logique de validation dispersée
- Code difficile à maintenir

**✅ Solution :**
Déplacer toute la logique métier dans le schéma Zod centralisé :

```typescript
// event.create.schema.ts
export const createEventSchema = z.object({
  // ... champs existants ...
}).refine(
  (data) => {
    // Validation inter-champs : startDate < endDate
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  },
  {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  }
).refine(
  (data) => {
    // Prix requis si non gratuit
    return data.isFree || (data.price && data.price > 0);
  },
  {
    message: "Le prix doit être positif si l'événement n'est pas gratuit",
    path: ["price"],
  }
);
```

**Avantages :**
- ✅ Validation centralisée
- ✅ Réutilisable côté client et serveur
- ✅ Plus facile à tester

---

### 5. **Améliorer le TypeScript**

**❌ Problème Actuel :**
```typescript
const [form, setForm] = useState<typeof initialForm>({ ...initialForm });
// Type inféré, pas explicite
```

**✅ Solution :**
```typescript
import type { createEventSchema } from "./event.create.schema";
type CreateEventFormData = z.infer<typeof createEventSchema>;

const [form, setForm] = useState<CreateEventFormData>({ ...initialForm });
```

---

### 6. **Gestion de `currentParticipants`**

**⚠️ Champ Manquant :**
Le schéma Prisma contient `currentParticipants` (ligne 239) mais il n'est pas dans le formulaire.

**✅ Solution :**
- Ne PAS ajouter ce champ au formulaire de création
- Il doit être géré automatiquement par le système (compteur d'inscriptions)
- Initialiser à `0` par défaut dans Prisma (déjà fait)

---

### 7. **Validation des URLs**

**✅ Déjà Correctement Fait :**
```typescript
const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
```

Mais peut être amélioré avec Zod :
```typescript
// Dans le schéma
featuredImage: z.string().url("URL invalide").optional(),
virtualLink: z.string().url("URL invalide").optional(),
registrationLink: z.string().url("URL invalide").optional(),
```

---

## 📊 Comparaison Schema Form vs Schema Action

### Champs dans le Formulaire mais PAS dans Prisma :
- ❌ Aucun (tous les champs correspondent)

### Champs dans Prisma mais PAS dans le Formulaire :
- ✅ `id` - Auto-généré
- ✅ `currentParticipants` - Calculé automatiquement
- ✅ `createdAt` - Timestamp auto
- ✅ `updatedAt` - Timestamp auto
- ✅ `videos` - Relation (géré séparément)
- ✅ `photos` - Relation (géré séparément)

**Conclusion :** Tous les champs requis sont présents ✓

---

## 🔧 Plan d'Action Recommandé

### Priorité 1 (Critique)
1. ✅ **Corriger la syntaxe** (fait)
2. ⬜ **Utiliser `createEventSchema` centralisé**
3. ⬜ **Corriger le type de `maxParticipants`**

### Priorité 2 (Important)
4. ⬜ **Typer les options avec EventType/EventStatus**
5. ⬜ **Déplacer la validation inter-champs vers le schéma Zod**

### Priorité 3 (Amélioration)
6. ⬜ **Améliorer les types TypeScript**
7. ⬜ **Utiliser `z.string().url()` pour les URLs**

---

## 📄 Exemple de Code Amélioré

```typescript
"use client";
import React, { useState, useRef } from "react";
import { createEventSchema } from "./event.create.schema";
import type { EventType, EventStatus } from "@/lib/validations/events";
import type { z } from "zod";

type CreateEventFormData = z.infer<typeof createEventSchema>;

// Options avec typage fort
const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "forum", label: "Forum" },
  { value: "workshop", label: "Atelier" },
  // ...
];

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
  // ...
];

// Validation simplifiée
function validate(form: CreateEventFormData, isEditor: boolean) {
  const zodResult = createEventSchema.safeParse(form);

  if (!zodResult.success) {
    const errors: Record<string, { field: string; message: string }> = {};
    zodResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0] as string] = {
          field: issue.path[0] as string,
          message: issue.message,
        };
      }
    });
    return errors;
  }

  return {};
}

export default function CreateEventForm() {
  const [form, setForm] = useState<CreateEventFormData>({
    title: "",
    slug: "",
    eventType: "forum",
    status: "draft",
    maxParticipants: null, // ✅ null au lieu de undefined
    // ...
  });

  // ...reste du code
}
```

---

## ✅ Vérifications Finales

- ✅ Tous les champs Prisma requis sont présents
- ✅ Les types correspondent au schéma Prisma
- ✅ La validation est cohérente
- ⬜ Le schéma est centralisé (à faire)
- ⬜ Les types TypeScript sont forts (à améliorer)

---

**Date :** 2025-12-11
**Fichiers Concernés :**
- `app/admin/events/event/create/CreateEventForm.tsx`
- `app/admin/events/event/create/event.create.schema.ts`
- `app/admin/events/event/create/event.create.action.ts`
- `prisma/schema.prisma`
- `lib/validations/events.ts`
