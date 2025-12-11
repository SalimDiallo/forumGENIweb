# 🇫🇷 Mise à Jour : Messages de Validation en Français

## ✅ Modifications Appliquées

### 1. **Schema de Création d'Événement** (`event.create.schema.ts`)

#### **Messages d'Erreur en Français**

Tous les messages de validation sont maintenant en français :

| Champ | Message d'Erreur |
|-------|------------------|
| `title` | "Le titre doit contenir au moins 2 caractères" |
| `slug` | "Le slug doit contenir au moins 2 caractères" |
| `shortDescription` | "La description courte ne peut pas dépasser 280 caractères" |
| `featuredImage` | "URL d'image invalide" |
| `virtualLink` | "URL de visioconférence invalide" |
| `maxParticipants` | "Le nombre de participants doit être un entier" |
| `maxParticipants` | "Le nombre de participants doit être positif" |
| `price` | "Le prix ne peut pas être négatif" |
| `price` | "Le prix est trop élevé" |
| `currency` | "Code devise invalide" |
| `organizerName` | "Le nom de l'organisateur doit contenir au moins 2 caractères" |
| `agenda` | "L'agenda est trop long (5000 caractères max)" |
| `speakers` | "La liste des intervenants est trop longue (5000 caractères max)" |
| `sponsors` | "La liste des sponsors est trop longue (5000 caractères max)" |
| `requirements` | "Les prérequis sont trop longs (2000 caractères max)" |
| `whatToBring` | "La liste est trop longue (2000 caractères max)" |
| `metaTitle` | "Le méta titre est trop long (90 caractères max)" |
| `metaDescription` | "La méta description est trop longue (255 caractères max)" |
| `registrationLink` | "URL d'inscription invalide" |

---

### 2. **Validation de Dates** (`event.create.schema.ts`)

#### **Messages d'Erreur en Français**

Les dates utilisent maintenant une validation directe avec messages en français :

```typescript
// Avant
startDate: z.union([dateSchema, z.date()])
endDate: z.union([dateSchema, z.date()])

// Après
startDate: z.string().min(1, "La date de début est requise").transform((str) => {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    throw new Error("Format de date de début invalide");
  }
  return date.toISOString();
}),
endDate: z.string().min(1, "La date de fin est requise").transform((str) => {
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    throw new Error("Format de date de fin invalide");
  }
  return date.toISOString();
}),
```

---

### 3. **maxParticipants : Non Requis**

#### **Avant :**
```typescript
maxParticipants: z.union([z.number().int().positive(), z.string()]).optional()
```

**Problème :** Pouvait causer des erreurs si laissé vide.

#### **Après :**
```typescript
maxParticipants: z
  .union([
    z.number().int("Le nombre de participants doit être un entier")
      .positive("Le nombre de participants doit être positif"),
    z.string(),
    z.null(),
  ])
  .optional()
  .nullable()
```

**Avantages :**
- ✅ Accepte `null` ou `undefined`
- ✅ Accepte les chaînes vides
- ✅ Messages d'erreur en français si valeur invalide
- ✅ Cohérent avec Prisma `Int?` (nullable)

---

### 4. **Validation Inter-Champs Ajoutée**

#### **Date de Fin après Date de Début**

```typescript
.refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  },
  {
    message: "La date de fin doit être après la date de début",
    path: ["endDate"],
  }
)
```

**Avant :** Validation uniquement dans le formulaire
**Après :** Validation centralisée dans le schéma Zod

---

#### **Prix Requis pour Événement Payant**

```typescript
.refine(
  (data) => {
    if (!data.isFree && data.price <= 0) {
      return false;
    }
    return true;
  },
  {
    message: "Le prix doit être supérieur à 0 pour un événement payant",
    path: ["price"],
  }
)
```

**Avant :** Validation uniquement dans le formulaire
**Après :** Validation centralisée dans le schéma Zod

---

### 5. **URLs : Gestion des Chaînes Vides**

#### **Avant :**
```typescript
featuredImage: z.string().url("URL d'image invalide").optional()
```

**Problème :** Une chaîne vide `""` échouait la validation `.url()`

#### **Après :**
```typescript
featuredImage: z.string().url({ message: "URL d'image invalide" }).optional().or(z.literal(""))
virtualLink: z.string().url({ message: "URL de visioconférence invalide" }).optional().or(z.literal(""))
registrationLink: z.string().url({ message: "URL d'inscription invalide" }).optional().or(z.literal(""))
```

**Note :** Utilisation de `{ message: "..." }` au lieu de la string directe pour éviter les avertissements de dépréciation dans Zod v4.

**Avantages :**
- ✅ Accepte les chaînes vides
- ✅ Valide les URLs si fournies
- ✅ Pas d'erreur si le champ est laissé vide

---

## 📊 Résumé des Changements

### **Fichiers Modifiés**

1. ✅ `app/admin/events/event/create/event.create.schema.ts`
   - Messages d'erreur en français
   - Validation de `maxParticipants` corrigée
   - Validation inter-champs ajoutée
   - Gestion des URLs vides

2. ✅ `lib/validations/events.ts`
   - Messages d'erreur de dates en français
   - Documentation améliorée

---

### **Avant vs Après**

| Aspect | Avant | Après |
|--------|-------|-------|
| **Messages d'erreur** | Anglais (par défaut Zod) | Français ✅ |
| **maxParticipants** | Requis (causait erreurs) | Optionnel et nullable ✅ |
| **URLs vides** | Échouaient validation | Acceptées ✅ |
| **Validation inter-champs** | Dans le formulaire | Dans le schéma Zod ✅ |
| **Cohérence** | Client ≠ Serveur | Client = Serveur ✅ |

---

## 🎯 Exemples de Messages

### **Validation de Champs**

```typescript
// Titre trop court
Input: "A"
Error: "Le titre doit contenir au moins 2 caractères"

// URL invalide
Input: "not-a-url"
Error: "URL d'image invalide"

// maxParticipants invalide
Input: -5
Error: "Le nombre de participants doit être positif"

// maxParticipants vide
Input: ""
Error: Aucune erreur ✅
```

### **Validation Inter-Champs**

```typescript
// Date de fin avant date de début
startDate: "2025-12-31T10:00"
endDate: "2025-01-01T10:00"
Error: "La date de fin doit être après la date de début"

// Événement payant sans prix
isFree: false
price: 0
Error: "Le prix doit être supérieur à 0 pour un événement payant"
```

---

## ✅ Tests de Validation

### **Test 1 : maxParticipants Non Requis**

```typescript
// Cas 1 : Champ vide (OK)
maxParticipants: null  // ✅ Valide
maxParticipants: undefined  // ✅ Valide
maxParticipants: ""  // ✅ Valide

// Cas 2 : Valeur valide (OK)
maxParticipants: 100  // ✅ Valide

// Cas 3 : Valeur invalide (Erreur)
maxParticipants: -5  // ❌ "Le nombre de participants doit être positif"
maxParticipants: 3.14  // ❌ "Le nombre de participants doit être un entier"
```

### **Test 2 : URLs Vides Acceptées**

```typescript
// Cas 1 : Champ vide (OK)
featuredImage: ""  // ✅ Valide
virtualLink: ""  // ✅ Valide

// Cas 2 : URL valide (OK)
featuredImage: "https://example.com/image.jpg"  // ✅ Valide

// Cas 3 : URL invalide (Erreur)
featuredImage: "not-a-url"  // ❌ "URL d'image invalide"
```

### **Test 3 : Validation de Dates**

```typescript
// Cas 1 : Dates valides (OK)
startDate: "2025-01-01T10:00"
endDate: "2025-12-31T23:00"  // ✅ Valide

// Cas 2 : Date de fin avant début (Erreur)
startDate: "2025-12-31T10:00"
endDate: "2025-01-01T10:00"  // ❌ "La date de fin doit être après la date de début"

// Cas 3 : Dates identiques (OK)
startDate: "2025-06-15T10:00"
endDate: "2025-06-15T18:00"  // ✅ Valide (même jour)
```

---

## 🔧 Utilisation dans le Formulaire

Le hook `useForm` détecte automatiquement les erreurs et affiche les messages en français :

```typescript
const form = useForm({
  initialValues,
  validationSchema: createEventSchema,  // ✅ Messages en français
  validateOnChange: true,
});

// Exemple d'utilisation
<Input
  value={form.values.title}
  onChange={(e) => form.setFieldValue("title", e.target.value)}
  error={form.hasError("title")}
  errorMessage={form.getError("title")}  // ✅ Message en français
/>
```

---

## 📝 Migration des Autres Schémas

Pour migrer d'autres schémas vers des messages en français, suivez ce pattern :

```typescript
// ❌ Avant (messages par défaut en anglais)
title: z.string().min(2)

// ✅ Après (messages en français)
title: z.string().min(2, "Le titre doit contenir au moins 2 caractères")
```

### **Patterns Communs**

```typescript
// String
z.string().min(2, "Minimum 2 caractères")
z.string().max(100, "Maximum 100 caractères")
z.string().email("Email invalide")
z.string().url("URL invalide")

// Number
z.number().min(0, "Ne peut pas être négatif")
z.number().max(1000, "Maximum 1000")
z.number().int("Doit être un entier")
z.number().positive("Doit être positif")

// Optional avec null
z.string().optional().nullable()
z.number().optional().nullable()

// URLs avec chaînes vides
z.string().url("URL invalide").optional().or(z.literal(""))
```

---

## 🎉 Résultat Final

### **Expérience Utilisateur Améliorée**

- ✅ Messages d'erreur clairs en français
- ✅ Champs optionnels correctement gérés
- ✅ Validation cohérente client/serveur
- ✅ Pas d'erreurs sur champs vides
- ✅ Validation inter-champs automatique

### **Code Plus Propre**

- ✅ Validation centralisée dans le schéma
- ✅ Moins de logique dans le formulaire
- ✅ Une seule source de vérité
- ✅ Facile à maintenir et tester

---

**Date :** 2025-12-11
**Version :** 2.1.0
**Statut :** ✅ Prêt pour Production
