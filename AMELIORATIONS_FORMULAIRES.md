# Améliorations des formulaires admin

Ce document décrit les améliorations apportées aux formulaires et à l'UX de l'interface admin.

## 🎯 Objectifs

1. **Messages d'erreur Zod en français** - Tous les messages de validation sont maintenant en français
2. **Toasts d'erreur automatiques** - Les erreurs de formulaire sont affichées dans des toasts élégants
3. **États de chargement améliorés** - Indicateurs visuels pendant les opérations
4. **Skeletons de chargement** - Chargement fluide des pages

## 📦 Nouveaux fichiers créés

### 1. Configuration Zod en français (`lib/zod-fr.ts`)

Configuration complète des messages d'erreur Zod en français avec :
- Messages personnalisés pour tous les types d'erreurs
- Helpers pour validations courantes (email, URL, slug, téléphone, etc.)
- Fonction `setupZodFrench()` pour activer globalement

**Utilisation :**
```typescript
import { zodHelpers, zodMessages } from "@/lib/zod-fr";

// Exemple de validation
const schema = z.object({
  email: zodHelpers.email(),
  slug: zodHelpers.slug(),
  phone: zodHelpers.phone(),
  password: zodHelpers.strongPassword(),
});
```

### 2. Hook de gestion des erreurs de formulaire (`hooks/use-form-toast.tsx`)

Hook automatique pour afficher les erreurs dans des toasts.

**Utilisation :**
```typescript
import { useFormToast } from "@/hooks/use-form-toast";

function MyForm() {
  const { formState: { errors } } = useForm();

  // Afficher automatiquement les erreurs dans des toasts
  useFormToast(errors, {
    showIndividualErrors: false, // Un seul toast avec toutes les erreurs
    errorTitle: "Veuillez corriger les erreurs suivantes :",
  });
}
```

**Utilitaires disponibles :**
```typescript
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  useServerErrorToast,
} from "@/hooks/use-form-toast";

// Toast de succès
showSuccessToast("Événement créé avec succès !");

// Toast d'erreur
showErrorToast("Une erreur est survenue");

// Toast de chargement
const loading = showLoadingToast("Enregistrement...");
// Plus tard...
loading.success("Enregistré avec succès !");
// ou
loading.error("Erreur lors de l'enregistrement");

// Erreurs serveur automatiques
useServerErrorToast(serverError);
```

### 3. Composants Skeleton (`components/ui/skeleton.tsx` et `components/admin/LoadingSkeletons.tsx`)

Composants réutilisables pour les états de chargement.

**Composants disponibles :**
- `StatCardSkeleton` - Pour les cartes de statistiques
- `TableRowSkeleton` - Pour les lignes de tableau
- `TableSkeleton` - Pour un tableau complet
- `FormSkeleton` - Pour les formulaires
- `ContentCardSkeleton` - Pour les cartes de contenu
- `PageSkeleton` - Pour une page complète
- `TabbedFormSkeleton` - Pour un formulaire à onglets
- `CardGridSkeleton` - Pour une grille de cartes
- `DashboardStatsSkeleton` - Pour les stats du dashboard
- `PaginatedListSkeleton` - Pour les listes paginées
- `CenteredLoadingSkeleton` - Pour un spinner centré

**Utilisation :**
```typescript
import { TableSkeleton } from "@/components/admin/LoadingSkeletons";

<TableSkeleton rows={10} columns={5} />
```

### 4. Pages de chargement Next.js

Fichiers `loading.tsx` créés pour les pages admin :
- `/app/admin/events/loading.tsx`
- `/app/admin/jobs/loading.tsx`
- `/app/admin/blog/posts/loading.tsx`

Ces fichiers sont automatiquement utilisés par Next.js pendant le chargement de la page.

## 🔄 Modifications apportées

### `app/Providers.tsx`
- Ajout de l'initialisation de Zod en français au montage
- Amélioration de la configuration de QueryClient

### `app/admin/events/event/create/CreateEventForm.tsx`
- Ajout du hook `useFormToast` pour afficher les erreurs
- Amélioration du bouton de soumission avec spinner de chargement (Loader2)
- Messages d'erreur automatiques dans des toasts

## 📋 Comment utiliser dans vos formulaires

### Étape 1 : Créer votre schéma Zod

```typescript
import { z } from "zod";
import { zodHelpers } from "@/lib/zod-fr";

export const myFormSchema = z.object({
  email: zodHelpers.email(),
  name: z.string().min(1, "Le nom est requis"),
  // Les messages sont automatiquement en français !
});
```

### Étape 2 : Utiliser le hook dans votre formulaire

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormToast } from "@/hooks/use-form-toast";
import { Loader2, Save } from "lucide-react";

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(myFormSchema),
  });

  // ✨ Affichage automatique des erreurs dans des toasts
  useFormToast(errors);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Votre logique
    },
  });

  return (
    <form onSubmit={handleSubmit(mutation.mutate)}>
      {/* Vos champs de formulaire */}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg disabled:opacity-50"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Enregistrer
          </>
        )}
      </button>
    </form>
  );
}
```

### Étape 3 : Ajouter un skeleton de chargement (optionnel)

Créer un fichier `loading.tsx` à côté de votre `page.tsx` :

```typescript
import { FormSkeleton } from "@/components/admin/LoadingSkeletons";

export default function Loading() {
  return <FormSkeleton fields={8} />;
}
```

## 🎨 Exemples de toasts

### Toast d'erreur de validation
```typescript
// Automatique avec useFormToast
useFormToast(errors);

// Résultat : Un toast rouge avec la liste des erreurs
```

### Toast de succès après soumission
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const result = await myAction(data);
    if (result.data) {
      showSuccessToast("Opération réussie !");
      router.push("/admin/dashboard");
    }
  },
});
```

### Toast d'erreur serveur
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const result = await myAction(data);
    if (result.serverError) {
      showErrorToast(result.serverError);
    }
  },
});
```

## 🔧 Configuration avancée

### Personnaliser les messages Zod

```typescript
import { zodMessages } from "@/lib/zod-fr";

const schema = z.object({
  age: z.number().min(18, "Vous devez avoir au moins 18 ans"),
  // ou utiliser les messages prédéfinis
  email: z.string().email(zodMessages.email),
});
```

### Toasts individuels vs résumé

```typescript
// Un toast par erreur
useFormToast(errors, { showIndividualErrors: true });

// Un seul toast avec toutes les erreurs (recommandé)
useFormToast(errors, { showIndividualErrors: false });
```

### Délai avant affichage (debounce)

```typescript
// Attendre 500ms avant d'afficher (évite trop de toasts pendant la saisie)
useFormToast(errors, { debounce: 500 });
```

## ✅ Checklist pour mettre à jour vos formulaires

- [ ] Importer `useFormToast` dans votre composant de formulaire
- [ ] Ajouter `useFormToast(errors)` après `useForm()`
- [ ] Remplacer le texte du bouton par une version avec `Loader2` pendant le chargement
- [ ] Créer un fichier `loading.tsx` avec un skeleton approprié
- [ ] Tester les erreurs de validation en français
- [ ] Vérifier que les toasts s'affichent correctement

## 🎉 Résultat

Vos formulaires admin ont maintenant :
- ✅ Messages d'erreur clairs en français
- ✅ Toasts élégants pour les erreurs et succès
- ✅ Indicateurs de chargement fluides
- ✅ Skeletons pendant le chargement des pages
- ✅ Meilleure expérience utilisateur globale

## 📝 Notes importantes

1. **Zod est configuré automatiquement** - Les messages en français sont activés au démarrage de l'app
2. **Les toasts sont configurés** - Sonner est déjà configuré dans `components/ui/sonner.tsx`
3. **Next.js gère les loading.tsx automatiquement** - Pas besoin de Suspense manuel
4. **Les composants sont réutilisables** - Utilisez-les dans tous vos formulaires !

## 🐛 Dépannage

### Les messages sont encore en anglais
Vérifiez que `setupZodFrench()` est bien appelé dans `app/Providers.tsx`

### Les toasts ne s'affichent pas
Vérifiez que `<Toaster />` est bien dans votre layout root

### Les skeletons ne s'affichent pas
Les fichiers `loading.tsx` doivent être au même niveau que les `page.tsx`
