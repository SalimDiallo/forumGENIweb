# Strategie de Cache - Forum Genie Entreprise

## Vue d'ensemble

Ce document decrit la strategie de cache implementee pour ameliorer les performances du site web Forum Genie Entreprise. Le cache utilise `unstable_cache` de Next.js avec des tags pour la revalidation ciblee.

## Architecture

### Module de Cache

**Fichier:** `lib/cache.ts`

Le module centralise toutes les fonctions de cache et definit les TTL (Time To Live) et tags appropries pour chaque type de donnees.

### Tags de Cache Definis

| Tag | Description | Utilisation |
|-----|-------------|-------------|
| `events` | Toutes les donnees d'evenements | Homepage, liste evenements, details evenements |
| `blog` | Tous les articles de blog | Liste blog, detail article |
| `testimonials` | Tous les temoignages video | Homepage, galerie |
| `media` | Toutes les medias de la galerie | Galerie media |
| `jobs` | Toutes les offres d'emploi | Page carrieres |
| `stats` | Statistiques du dashboard | Dashboard admin |

## Fonctions de Cache Implementees

### Evenements

#### `getCachedUpcomingEvents(limit)`
- **TTL:** 1 heure (3600s)
- **Tag:** `events`
- **Usage:** Homepage - affiche les 2 prochains evenements en vedette
- **Cache Key:** `['upcoming-events']`

```typescript
// Exemple d'utilisation
const result = await getCachedUpcomingEvents(2);
```

#### `getCachedEvents()`
- **TTL:** 1 heure (3600s)
- **Tag:** `events`
- **Usage:** Page liste des evenements
- **Cache Key:** `['events-list']`

#### `getCachedEventBySlug(slug)`
- **TTL:** 1 heure (3600s)
- **Tag:** `events`
- **Usage:** Page detail d'un evenement
- **Cache Key:** `['event-by-slug']`

#### `getCachedRelatedEvents(currentEventId, eventType, limit)`
- **TTL:** 1 heure (3600s)
- **Tag:** `events`
- **Usage:** Evenements similaires sur la page detail
- **Cache Key:** `['related-events']`

### Temoignages Video

#### `getCachedActiveTestimonials(limit)`
- **TTL:** 1 heure (3600s)
- **Tag:** `testimonials`
- **Usage:** Homepage et galerie
- **Cache Key:** `['active-testimonials']`

#### `getCachedFeaturedTestimonials(limit)`
- **TTL:** 1 heure (3600s)
- **Tag:** `testimonials`
- **Usage:** Section temoignages en vedette
- **Cache Key:** `['featured-testimonials']`

### Blog

#### `getCachedBlogPosts(limit)`
- **TTL:** 30 minutes (1800s)
- **Tag:** `blog`
- **Usage:** Liste des articles de blog
- **Cache Key:** `['blog-posts']`

#### `getCachedBlogPostById(id)`
- **TTL:** 30 minutes (1800s)
- **Tag:** `blog`
- **Usage:** Page detail d'un article
- **Cache Key:** `['blog-post-by-id']`

#### `getCachedBlogCategories()`
- **TTL:** 1 heure (3600s)
- **Tag:** `blog`
- **Usage:** Liste des categories de blog
- **Cache Key:** `['blog-categories']`

### Media (Galerie)

#### `getCachedGalleryMedia()`
- **TTL:** 1 heure (3600s)
- **Tag:** `media`
- **Usage:** Galerie de photos/videos
- **Cache Key:** `['gallery-media']`

### Emplois

#### `getCachedActiveJobs(limit)`
- **TTL:** 30 minutes (1800s)
- **Tag:** `jobs`
- **Usage:** Page carrieres
- **Cache Key:** `['active-jobs']`

### Statistiques Dashboard

#### `getCachedDashboardStats()`
- **TTL:** 5 minutes (300s)
- **Tag:** `stats`
- **Usage:** Dashboard admin (statistiques)
- **Cache Key:** `['dashboard-stats']`

## Systeme de Revalidation

### Principe

Lorsqu'une donnee est modifiee (creation, mise a jour, suppression), le cache correspondant est invalide via `revalidateTag()`.

### Actions avec Revalidation

#### Evenements

**Fichiers:**
- `app/admin/events/event/create/event.create.action.ts`
- `app/admin/events/event/[eventId]/edit/event.edit.action.ts`

```typescript
import { revalidateTag } from 'next/cache';

// Apres creation/modification
revalidateTag('events');
```

#### Blog

**Fichier:** `app/admin/blog/posts-actions.ts`

Actions concernees:
- `createBlogPost` - Revalidate apres creation
- `updateBlogPost` - Revalidate apres mise a jour
- `deleteBlogPost` - Revalidate apres suppression
- `toggleFeatured` - Revalidate apres changement de statut featured

```typescript
// Apres mutation
revalidateTag('blog');
```

#### Temoignages

**Fichier:** `app/admin/testimonials/actions.ts`

Actions concernees:
- `createTestimonial`
- `updateTestimonial`
- `deleteTestimonial`

```typescript
// Apres mutation
revalidateTag('testimonials');
```

#### Media

**Fichier:** `app/admin/media/actions.ts`

Actions concernees:
- `createMedia`
- `updateMedia`
- `deleteMedia`

```typescript
// Apres mutation
revalidateTag('media');
```

## TTL Choisis et Justifications

| Type de Donnee | TTL | Justification |
|----------------|-----|---------------|
| Evenements | 1 heure | Les evenements changent peu frequemment |
| Blog Posts | 30 minutes | Articles mis a jour plus regulierement |
| Temoignages | 1 heure | Contenu relativement stable |
| Media Galerie | 1 heure | Contenu stable, peu de modifications |
| Jobs | 30 minutes | Offres d'emploi necessitent fraicheur relative |
| Stats Dashboard | 5 minutes | Statistiques doivent etre relativement a jour |

## Fichiers Modifies

### Queries Modifiees pour Utiliser le Cache

1. **`app/actions/home-sections.ts`**
   - `getUpcomingEvents()` → Utilise `getCachedUpcomingEvents()`
   - `getFeaturedTestimonials()` → Utilise `getCachedFeaturedTestimonials()`
   - `getActiveTestimonials()` → Utilise `getCachedActiveTestimonials()`

2. **`app/(sections)/events/events.query.ts`**
   - `getEvents()` → Utilise `getCachedEvents()`

3. **`app/(sections)/events/[slug]/event-detail.query.ts`**
   - `getEventBySlug()` → Utilise `getCachedEventBySlug()`
   - `getRelatedEvents()` → Utilise `getCachedRelatedEvents()`

### Actions Modifiees pour Revalider le Cache

1. **Evenements:**
   - `app/admin/events/event/create/event.create.action.ts`
   - `app/admin/events/event/[eventId]/edit/event.edit.action.ts`

2. **Blog:**
   - `app/admin/blog/posts-actions.ts`

3. **Temoignages:**
   - `app/admin/testimonials/actions.ts`

4. **Media:**
   - `app/admin/media/actions.ts`

## Gain de Performance Estime

### Avant Cache
- Homepage: ~800ms (4-5 queries Prisma)
- Liste Evenements: ~400ms (1-2 queries)
- Detail Evenement: ~500ms (2-3 queries)
- Blog: ~600ms (2-3 queries avec relations)

### Apres Cache (apres premier chargement)
- Homepage: ~50-100ms (donnees en cache)
- Liste Evenements: ~30-50ms
- Detail Evenement: ~40-60ms
- Blog: ~50-80ms

### Gain Estime
- **Homepage:** ~85-90% reduction du temps de chargement
- **Autres pages:** ~85-90% reduction du temps de chargement
- **Reduction de charge DB:** ~80-90% moins de requetes repetees

## Tests de Revalidation

### Test Manuel

1. **Creation d'evenement:**
   ```bash
   # 1. Charger la homepage (donnees en cache)
   # 2. Creer un nouvel evenement via /admin/events
   # 3. Recharger la homepage → Le nouvel evenement devrait apparaitre
   ```

2. **Modification d'article de blog:**
   ```bash
   # 1. Charger /blog (donnees en cache)
   # 2. Modifier un article via /admin/blog
   # 3. Recharger /blog → Les modifications devraient etre visibles
   ```

3. **Suppression de temoignage:**
   ```bash
   # 1. Charger homepage avec temoignages (donnees en cache)
   # 2. Supprimer un temoignage via /admin/testimonials
   # 3. Recharger homepage → Le temoignage ne devrait plus apparaitre
   ```

### Verifications Automatiques

Pour verifier le bon fonctionnement du cache:

```typescript
// Dans un fichier de test
import { unstable_cache } from 'next/cache';

// Verifier que les tags sont correctement definis
// Les logs Next.js montreront les tags utilises lors du build
```

## Bonnes Pratiques

### A FAIRE
- Toujours appeler `revalidateTag()` apres une mutation
- Utiliser des TTL appropries selon la frequence de mise a jour
- Tester la revalidation apres chaque modification d'action

### A NE PAS FAIRE
- Ne PAS cacher les requetes admin (donnees temps reel necessaires)
- Ne PAS mettre de TTL trop long (max 1h recommande)
- Ne PAS oublier d'ajouter `revalidateTag()` dans les nouvelles actions

## Monitoring

Pour monitorer l'efficacite du cache:

1. **Next.js Build Output:** Affiche les routes et leur statut de cache
2. **DevTools Network:** Observer la reduction des temps de reponse
3. **Logs serveur:** Verifier la reduction du nombre de queries DB

## Maintenance Future

### Ajout de Nouvelles Queries a Cacher

1. Identifier la query dans le code
2. Creer une fonction cachee dans `lib/cache.ts`
3. Definir un TTL approprie et un tag
4. Remplacer l'appel direct par l'appel cache
5. Ajouter `revalidateTag()` dans les actions correspondantes
6. Mettre a jour cette documentation

### Modification des TTL

Si les performances ou la fraicheur des donnees ne sont pas optimales:
- Augmenter le TTL si les donnees sont trop statiques
- Diminuer le TTL si les donnees doivent etre plus fraiches
- Ajuster dans `lib/cache.ts` uniquement

## Conclusion

Cette strategie de cache ameliore significativement les performances du site tout en maintenant la fraicheur des donnees grace au systeme de revalidation par tags. Le cache est transparent pour les utilisateurs et facile a maintenir pour les developpeurs.
