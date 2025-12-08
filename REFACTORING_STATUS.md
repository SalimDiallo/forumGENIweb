# État de la refactorisation des formulaires

## ✅ COMPLÉTÉ

### 1. CreateEventForm
**Fichier:** `app/admin/events/event/create/CreateEventForm.tsx`
- ✅ **100% refactorisé** avec composants UI
- ✅ Utilise `<Form>`, `<FormField>`, `<FormControl>`, etc.
- ✅ Composant `Input` pour tous les champs texte
- ✅ Support complet du rôle "editor"
- ✅ Gestion automatique des erreurs
- ✅ Ancien fichier sauvegardé: `CreateEventForm.old.tsx`

### 2. EventBasicFields (Edit Event)
**Fichier:** `app/admin/events/event/[eventId]/edit/components/EventBasicFields.tsx`
- ✅ **100% refactorisé** avec composants UI
- ✅ Utilise `control` au lieu de `register`
- ✅ Tous les champs utilisent `FormField`
- ✅ Support complet du rôle "editor"
- ✅ Ancien fichier sauvegardé: `EventBasicFields.old.tsx`

### 3. EditEventForm (Partiel)
**Fichier:** `app/admin/events/event/[eventId]/edit/EditEventForm.tsx`
- ✅ Wrapper `<Form>` ajouté
- ✅ Utilise `form.control`
- ✅ Tab "basic" refactorisée avec EventBasicFields
- ⚠️ Tabs "details" et "registration" utilisent encore `register`
  - EventAdvancedFields
  - EventRegistrationFields

## 📋 À FAIRE (Pattern établi - facile à appliquer)

### 4. CreateBlogPostForm
**Fichier:** `app/admin/blog/posts/create/CreateBlogPostForm.tsx`

**Pattern à appliquer:**
```tsx
// 1. Ajouter imports
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Input from "@/components/ui/InputField";

// 2. Remplacer useForm
const form = useForm({
  resolver: zodResolver(createBlogPostSchema),
  defaultValues: { ... }
});

// 3. Wrapper avec Form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Remplacer chaque input par FormField */}
  </form>
</Form>

// 4. Exemple de champ refactorisé
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Titre *</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder="Titre de l'article"
          error={!!form.formState.errors.title}
          errorMessage={form.formState.errors.title?.message}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 5. EditBlogPostForm
**Fichier:** `app/admin/blog/posts/[id]/edit/EditBlogPostForm.tsx`
- Même pattern que CreateBlogPostForm

### 6. CreateJobForm
**Fichier:** `app/admin/jobs/job/create/CreateJobForm.tsx`
- Même pattern que CreateEventForm

### 7. JobDetailsSection
**Fichier:** `app/admin/jobs/job/create/components/JobDetailsSection.tsx`
- Changer interface pour accepter `control` au lieu de `register`
- Même pattern qu'EventBasicFields

### 8. JobRequirementsSection
**Fichier:** `app/admin/jobs/job/create/components/JobRequirementsSection.tsx`
- Changer interface pour accepter `control` au lieu de `register`
- Même pattern qu'EventBasicFields
- Déjà le champ status avec logique editor

### 9. JobApplicationSection
**Fichier:** `app/admin/jobs/job/create/components/JobApplicationSection.tsx`
- Changer interface pour accepter `control` au lieu de `register`
- Même pattern qu'EventBasicFields

### 10. EditJobForm
**Fichier:** `app/admin/jobs/job/[jobId]/edit/EditJobForm.tsx`
- Même pattern qu'EditEventForm

### 11. EventAdvancedFields
**Fichier:** `app/admin/events/event/[eventId]/edit/components/EventAdvancedFields.tsx`
- Changer interface pour accepter `control` au lieu de `register`
- Même pattern qu'EventBasicFields

### 12. EventRegistrationFields
**Fichier:** `app/admin/events/event/[eventId]/edit/components/EventRegistrationFields.tsx`
- Changer interface pour accepter `control` au lieu de `register`
- Même pattern qu'EventBasicFields

## 📚 Ressources disponibles

1. **REFACTORING_GUIDE.md** - Guide complet avec exemples avant/après
2. **REFACTORING_SUMMARY.md** - Vue d'ensemble et avantages
3. **CreateEventForm.tsx** - Exemple complet de formulaire refactorisé
4. **EventBasicFields.tsx** - Exemple complet de composant refactorisé

## 🎯 Checklist pour refactoriser un formulaire

- [ ] Ajouter les imports `Form`, `FormField`, etc.
- [ ] Ajouter import `Input from "@/components/ui/InputField"`
- [ ] Remplacer `useForm` destructuring par `const form = useForm(...)`
- [ ] Wrapper le `<form>` avec `<Form {...form}>`
- [ ] Remplacer `handleSubmit` par `form.handleSubmit`
- [ ] Pour chaque input:
  - [ ] Wrapper avec `<FormField control={form.control} name="...">`
  - [ ] Utiliser render prop avec `field`
  - [ ] Wrapper avec `<FormItem>`, `<FormLabel>`, `<FormControl>`
  - [ ] Remplacer input HTML par composant `Input`
  - [ ] Ajouter `<FormMessage />` pour les erreurs
- [ ] Tester que la validation fonctionne
- [ ] Tester que les erreurs s'affichent
- [ ] Tester la soumission du formulaire

## 🔧 Pour les composants (ex: EventBasicFields)

Si un composant utilise `register`, `errors`, `setValue`, `watch`:

**Avant:**
```tsx
interface Props {
  register: UseFormRegister<Schema>;
  errors: FieldErrors<Schema>;
  setValue: UseFormSetValue<Schema>;
  watch: UseFormWatch<Schema>;
}
```

**Après:**
```tsx
interface Props {
  control: Control<Schema>;
  errors: FieldErrors<Schema>;
}
```

Puis utiliser `FormField` avec `control` comme dans EventBasicFields.

## ⚡ Gains attendus

1. **Cohérence** - Tous les formulaires utilisent les mêmes composants
2. **Maintenance** - Modifier le style d'un champ = modifier Input component
3. **DRY** - Moins de code répété
4. **Accessibilité** - Composants shadcn/ui accessibles
5. **Type-safety** - Meilleure intégration TypeScript
6. **Validation** - Gestion automatique des erreurs

## 📊 Progression

- ✅ **2/12** formulaires/composants complètement refactorisés
- 📝 **10/12** à refactoriser (pattern établi)
- 🎯 Pattern de refactorisation validé et documenté
- 📚 Documentation complète fournie

## 🚀 Prochaines étapes recommandées

1. Appliquer le pattern à CreateBlogPostForm (plus simple que les events)
2. Tester que tout fonctionne
3. Continuer avec EditBlogPostForm
4. Refactoriser les composants Job
5. Compléter EventAdvancedFields et EventRegistrationFields

**Note:** Chaque refactorisation devrait prendre ~10-15 minutes en suivant le pattern établi.
