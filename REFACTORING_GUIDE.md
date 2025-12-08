# Guide de refactorisation des formulaires avec les composants UI

## Pattern à suivre

### Avant (code HTML brut)
```tsx
<div>
  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
    Titre de l'événement *
  </label>
  <input
    id="title"
    {...register("title")}
    placeholder="Ex: Forum Entrepreneuriat 2025"
    className={getInputClasses("title")}
  />
  {errors.title && (
    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {errors.title.message as string}
    </p>
  )}
</div>
```

### Après (avec composants UI)
```tsx
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Titre de l'événement *</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder="Ex: Forum Entrepreneuriat 2025"
          error={!!errors.title}
          errorMessage={errors.title?.message}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Pour les champs avec condition (ex: editor)

### Avant
```tsx
<div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
    Statut *
    {isEditor && (
      <span className="ml-2 text-xs text-amber-600 font-normal">
        (Brouillon uniquement pour les éditeurs)
      </span>
    )}
  </label>
  <select
    id="status"
    {...register("status")}
    disabled={isEditor}
    className={`${getInputClasses("status")} ${isEditor ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}`}
  >
    {statusOptions.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
  {isEditor && (
    <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      En tant qu'éditeur, vous ne pouvez créer que des brouillons
    </p>
  )}
</div>
```

### Après (avec composants UI)
```tsx
<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Statut *
        {isEditor && (
          <span className="ml-2 text-xs text-amber-600 font-normal">
            (Brouillon uniquement)
          </span>
        )}
      </FormLabel>
      <FormControl>
        <select
          {...field}
          disabled={isEditor}
          className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
            isEditor ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
          }`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormControl>
      {isEditor && (
        <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          En tant qu'éditeur, vous ne pouvez créer que des brouillons
        </p>
      )}
      <FormMessage />
    </FormItem>
  )}
/>
```

## Structure complète du formulaire

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Input from "@/components/ui/InputField";

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ... }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Vos champs ici avec FormField */}
        </div>

        <button type="submit">Soumettre</button>
      </form>
    </Form>
  );
}
```

## Avantages de cette approche

1. **Cohérence** : Tous les formulaires utilisent les mêmes composants
2. **Accessibilité** : Les composants shadcn/ui sont accessibles par défaut
3. **Maintenance** : Un seul endroit pour modifier le style des champs
4. **Validation** : Gestion automatique des erreurs et des états
5. **Type-safety** : Meilleure intégration avec TypeScript

## Notes importantes

- Le composant `Form` doit englober le `<form>` HTML
- Utilisez `form.control` au lieu de `register` pour FormField
- Le composant `Input` personnalisé gère déjà les erreurs via les props `error` et `errorMessage`
- Pour les selects, vous pouvez continuer à utiliser `<select>` natif ou créer un composant Select
