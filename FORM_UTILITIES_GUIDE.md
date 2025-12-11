# 📚 Guide des Utilitaires de Formulaire

## Vue d'Ensemble

Ce guide explique comment utiliser les utilitaires de formulaire réutilisables créés pour l'application.

### 📦 Fichiers Créés

1. **`lib/form-utils.ts`** - Fonctions utilitaires pour les formulaires
2. **`hooks/useForm.ts`** - Hook personnalisé pour la gestion de formulaires
3. **`hooks/useSlug.ts`** - Hook personnalisé pour la gestion des slugs
4. **`components/forms/SlugField.tsx`** - Composant réutilisable pour les slugs

---

## 🎯 lib/form-utils.ts

### Utilitaires de Validation

#### `validateWithZod<T>(schema, data): FormErrors`
Valide des données avec un schéma Zod.

```typescript
import { validateWithZod } from "@/lib/form-utils";
import { createEventSchema } from "./event.schema";

const errors = validateWithZod(createEventSchema, formData);
if (Object.keys(errors).length === 0) {
  // Formulaire valide
}
```

#### `zodErrorsToFormErrors(zodError): FormErrors`
Convertit les erreurs Zod en format FormErrors.

```typescript
const result = schema.safeParse(data);
if (!result.success) {
  const errors = zodErrorsToFormErrors(result.error);
}
```

#### `getFieldError(field, errors, touched): string | undefined`
Récupère le message d'erreur pour un champ.

```typescript
const errorMsg = getFieldError("email", errors, touched);
```

#### `hasFieldError(field, errors, touched): boolean`
Vérifie si un champ a une erreur.

```typescript
const hasError = hasFieldError("email", errors, touched);
```

#### `markAllTouched(formData): FormTouched`
Marque tous les champs comme touchés (utile lors de la soumission).

```typescript
const touched = markAllTouched(formData);
setTouched(touched);
```

---

### Utilitaires de Slug

#### `slugify(text): string`
Convertit du texte en slug URL-friendly.

```typescript
import { slugify } from "@/lib/form-utils";

slugify("Forum Génie Entreprise 2025")
// => "forum-genie-entreprise-2025"
```

#### `generateUniqueSlug(baseSlug, existingSlugs): string`
Génère un slug unique en ajoutant un numéro si nécessaire.

```typescript
const slug = generateUniqueSlug("forum-2025", ["forum-2025", "forum-2025-2"]);
// => "forum-2025-3"
```

---

### Utilitaires d'URL

#### `isValidUrl(url): boolean`
Valide une URL.

```typescript
import { isValidUrl } from "@/lib/form-utils";

isValidUrl("https://example.com") // => true
isValidUrl("not-a-url") // => false
```

#### `urlValidator` (pour Zod)
Validateur d'URL pour schémas Zod.

```typescript
import { urlValidator } from "@/lib/form-utils";

const schema = z.object({
  website: z.string().optional().refine(...urlValidator),
});
```

---

### Utilitaires de Date

#### `isValidDate(dateString): boolean`
Valide une date.

#### `isDateRangeValid(startDate, endDate): boolean`
Vérifie qu'une plage de dates est valide.

```typescript
isDateRangeValid("2025-01-01", "2025-12-31") // => true
isDateRangeValid("2025-12-31", "2025-01-01") // => false
```

#### `datetimeLocalToISO(datetimeLocal): string`
Convertit datetime-local en ISO.

#### `isoToDatetimeLocal(isoString): string`
Convertit ISO en datetime-local.

---

### Utilitaires de Select

#### `booleanToSelectValue(value): string`
Convertit boolean en valeur de select.

```typescript
booleanToSelectValue(true) // => "true"
```

#### `selectValueToBoolean(value): string`
Convertit valeur de select en boolean.

```typescript
selectValueToBoolean("true") // => true
```

---

### Utilitaires de Nombre

#### `parseNumber(value): number | null`
Parse un string en number (retourne null si invalide).

```typescript
parseNumber("123") // => 123
parseNumber("") // => null
parseNumber("abc") // => null
```

#### `parsePositiveInt(value): number | null`
Parse un string en entier positif.

---

### Utilitaires de Soumission

#### `formatErrorsForToast(errors, maxErrors?): string[]`
Formate les erreurs pour les toasts.

```typescript
const messages = formatErrorsForToast(errors, 4);
toast.error(
  <ul>
    {messages.map((msg, i) => <li key={i}>{msg}</li>)}
  </ul>
);
```

#### `hasFormErrors(errors): boolean`
Vérifie si le formulaire a des erreurs.

#### `resetFormState(initialValues, setForm, setErrors, setTouched)`
Réinitialise l'état du formulaire.

---

## 🪝 hooks/useForm.ts

Hook complet pour la gestion de formulaires avec validation Zod.

### Exemple d'Utilisation

```typescript
import { useForm } from "@/hooks/useForm";
import { createEventSchema } from "./event.schema";

const form = useForm({
  initialValues: {
    title: "",
    slug: "",
    status: "draft",
  },
  validationSchema: createEventSchema,
  validateOnChange: true,
});

// Dans le JSX
<input
  value={form.values.title}
  onChange={(e) => form.setFieldValue("title", e.target.value)}
  onBlur={() => form.setFieldTouched("title")}
/>
{form.getError("title") && (
  <span className="text-red-600">{form.getError("title")}</span>
)}

<button
  onClick={form.handleSubmit(async (values) => {
    await submitForm(values);
  })}
>
  Soumettre
</button>
```

### API du Hook

| Propriété | Type | Description |
|-----------|------|-------------|
| `values` | `T` | Valeurs actuelles du formulaire |
| `errors` | `FormErrors` | Erreurs du formulaire |
| `touched` | `FormTouched` | Champs touchés |
| `isSubmitting` | `boolean` | Formulaire en cours de soumission |
| `isValid` | `boolean` | Formulaire valide |
| `isDirty` | `boolean` | Formulaire modifié |
| `setFieldValue` | `(field, value) => void` | Définir valeur d'un champ |
| `setFieldTouched` | `(field) => void` | Marquer champ comme touché |
| `setFieldError` | `(field, error) => void` | Définir erreur d'un champ |
| `getError` | `(field) => string \| undefined` | Récupérer erreur |
| `hasError` | `(field) => boolean` | Vérifier si erreur |
| `validateForm` | `() => FormErrors` | Valider formulaire |
| `validateField` | `(field) => void` | Valider un champ |
| `handleSubmit` | `(onSubmit) => (e) => Promise<void>` | Gérer soumission |
| `resetForm` | `() => void` | Réinitialiser formulaire |

---

## 🪝 hooks/useSlug.ts

Hook pour la gestion automatique des slugs.

### Exemple d'Utilisation

```typescript
import { useSlug } from "@/hooks/useSlug";

const slug = useSlug({
  sourceText: form.values.title,
  onSlugChange: (value) => form.setFieldValue("slug", value),
});

// Dans le JSX
<input
  ref={slug.mode === "custom" ? slug.slugInputRef : undefined}
  value={slug.slug}
  readOnly={slug.mode === "auto"}
  onChange={(e) => slug.setSlug(e.target.value)}
/>
<button onClick={slug.enableCustomMode}>
  <Pencil className="w-4 h-4" />
</button>
```

### API du Hook

| Propriété | Type | Description |
|-----------|------|-------------|
| `slug` | `string` | Valeur actuelle du slug |
| `mode` | `"auto" \| "custom"` | Mode actuel |
| `slugInputRef` | `RefObject<HTMLInputElement>` | Ref pour l'input |
| `setSlug` | `(value: string) => void` | Définir le slug |
| `enableCustomMode` | `() => void` | Activer mode manuel |
| `enableAutoMode` | `() => void` | Activer mode auto |
| `toggleMode` | `() => void` | Basculer entre modes |

---

## 🧩 components/forms/SlugField.tsx

Composant réutilisable pour les champs de slug.

### Exemple d'Utilisation

```typescript
import SlugField from "@/components/forms/SlugField";
import { useSlug } from "@/hooks/useSlug";

const slug = useSlug({
  sourceText: form.values.title,
  onSlugChange: (value) => form.setFieldValue("slug", value),
});

<SlugField
  value={slug.slug}
  mode={slug.mode}
  inputRef={slug.slugInputRef}
  onChange={slug.setSlug}
  onEditClick={slug.enableCustomMode}
  onAutoClick={slug.enableAutoMode}
  error={form.getError("slug")}
  label="Slug de l'événement"
/>
```

---

## 📝 Exemple Complet : Formulaire d'Événement

Voici un exemple complet utilisant tous les utilitaires :

```typescript
"use client";

import React from "react";
import { useForm } from "@/hooks/useForm";
import { useSlug } from "@/hooks/useSlug";
import SlugField from "@/components/forms/SlugField";
import { createEventSchema } from "./event.schema";
import { doCreateEvent } from "./event.action";
import { toast } from "sonner";

export default function CreateEventForm() {
  // Form management
  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      eventType: "forum",
      status: "draft",
      startDate: "",
      endDate: "",
    },
    validationSchema: createEventSchema,
    validateOnChange: true,
  });

  // Slug management
  const slug = useSlug({
    sourceText: form.values.title,
    onSlugChange: (value) => form.setFieldValue("slug", value),
  });

  // Submit handler
  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await doCreateEvent(values);

    if (result?.data) {
      toast.success("Événement créé !");
      form.resetForm();
    } else if (result?.serverError) {
      toast.error(result.serverError);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div>
        <label>Titre</label>
        <input
          value={form.values.title}
          onChange={(e) => form.setFieldValue("title", e.target.value)}
          onBlur={() => form.setFieldTouched("title")}
        />
        {form.getError("title") && (
          <span className="text-red-600">{form.getError("title")}</span>
        )}
      </div>

      {/* Slug */}
      <SlugField
        value={slug.slug}
        mode={slug.mode}
        inputRef={slug.slugInputRef}
        onChange={slug.setSlug}
        onEditClick={slug.enableCustomMode}
        onAutoClick={slug.enableAutoMode}
        error={form.getError("slug")}
      />

      {/* Submit */}
      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? "Création..." : "Créer"}
      </button>
    </form>
  );
}
```

---

## ✅ Avantages de ces Utilitaires

### 1. **Réutilisabilité**
- Les mêmes utilitaires pour tous les formulaires
- Moins de code dupliqué
- Cohérence dans toute l'application

### 2. **Type Safety**
- TypeScript intégré
- Autocomplete dans l'IDE
- Détection d'erreurs à la compilation

### 3. **Validation Centralisée**
- Utilise les schémas Zod existants
- Validation client/serveur cohérente
- Messages d'erreur uniformes

### 4. **Meilleure UX**
- Validation en temps réel
- Gestion automatique des slugs
- Feedback immédiat

### 5. **Maintenabilité**
- Code organisé et modulaire
- Facile à tester
- Facile à étendre

---

## 🔄 Migration des Formulaires Existants

Pour migrer un formulaire existant :

1. **Remplacer la gestion d'état**
   ```typescript
   // Avant
   const [form, setForm] = useState(initialValues);
   const [errors, setErrors] = useState({});

   // Après
   const form = useForm({
     initialValues,
     validationSchema: mySchema,
   });
   ```

2. **Utiliser le hook useSlug**
   ```typescript
   const slug = useSlug({
     sourceText: form.values.title,
     onSlugChange: (value) => form.setFieldValue("slug", value),
   });
   ```

3. **Remplacer la validation**
   ```typescript
   // Avant
   function validate(data) {
     const result = schema.safeParse(data);
     // ... conversion manuelle
   }

   // Après
   // Géré automatiquement par useForm !
   ```

4. **Simplifier la soumission**
   ```typescript
   // Avant
   const handleSubmit = async (e) => {
     e.preventDefault();
     const errors = validate(form);
     if (errors) return;
     // ...
   };

   // Après
   const handleSubmit = form.handleSubmit(async (values) => {
     await submitForm(values);
   });
   ```

---

## 📚 Ressources

- **Zod Documentation**: https://zod.dev
- **React Hook Form** (inspiration): https://react-hook-form.com
- **Formik** (inspiration): https://formik.org

---

**Date de Création:** 2025-12-11
**Version:** 1.0.0
