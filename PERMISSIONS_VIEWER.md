# Système de Permissions - Rôle VIEWER (Lecture Seule)

## Vue d'ensemble

Le système de permissions a été configuré pour que les utilisateurs avec le rôle **VIEWER** aient un accès en **lecture seule** à l'interface d'administration. Ils peuvent consulter toutes les données mais ne peuvent ni créer, ni modifier, ni supprimer de contenu.

## Rôles Disponibles

- **`viewer`** : Accès en lecture seule (consultation uniquement)
- **`admin`** : Accès complet (lecture, création, modification, suppression)
- **`super_admin`** : Accès complet + gestion des utilisateurs

## Architecture

### 1. Contrôle côté Serveur (Actions)

Toutes les actions serveur sont protégées par des middlewares de permission :

```typescript
// Lecture seule - accessible à tous les rôles authentifiés
export const listJobs = actionClient
  .metadata({ actionName: "list-jobs" })
  .action(async () => { /* ... */ });

// Création/Modification - bloqué pour les VIEWERS
export const createJob = writeAction
  .metadata({ actionName: "create-job" })
  .schema(createJobSchema)
  .action(async ({ parsedInput }) => { /* ... */ });

// Suppression - bloqué pour les VIEWERS
export const deleteJob = deleteAction
  .metadata({ actionName: "delete-job" })
  .schema(deleteJobSchema)
  .action(async ({ parsedInput }) => { /* ... */ });
```

#### Clients d'Action Disponibles

- **`actionClient`** : Authentification requise (tous les rôles)
- **`writeAction`** : Bloque les VIEWERS (création/modification)
- **`deleteAction`** : Bloque les VIEWERS (suppression)
- **`adminAction`** : Bloque les VIEWERS (actions admin générales)
- **`superAdminAction`** : Uniquement pour les SUPER_ADMIN

### 2. Contrôle côté Client (Interface)

#### Hook `useUserRole`

Permet de vérifier le rôle de l'utilisateur dans les composants React :

```typescript
import { useUserRole } from '@/hooks/use-user-role';

function MyComponent() {
  const {
    role,           // 'viewer' | 'admin' | 'super_admin'
    isLoading,      // true pendant le chargement
    isViewer,       // true si role === 'viewer'
    isAdmin,        // true si role === 'admin' ou 'super_admin'
    isSuperAdmin,   // true si role === 'super_admin'
    canWrite,       // true si peut créer/modifier
    canDelete,      // true si peut supprimer
  } = useUserRole();

  return (
    <div>
      {canWrite && <Button>Créer</Button>}
      {canDelete && <Button variant="destructive">Supprimer</Button>}
    </div>
  );
}
```

#### Composant `ProtectedAction`

Masque automatiquement les actions pour les VIEWERS :

```typescript
import { ProtectedAction } from '@/components/admin/ProtectedAction';

// Bouton de création - masqué pour les VIEWERS
<ProtectedAction action="write">
  <Button onClick={handleCreate}>
    <Plus className="w-4 h-4 mr-2" />
    Créer un article
  </Button>
</ProtectedAction>

// Bouton de modification - masqué pour les VIEWERS
<ProtectedAction action="write">
  <Button onClick={handleEdit}>Modifier</Button>
</ProtectedAction>

// Bouton de suppression - masqué pour les VIEWERS
<ProtectedAction action="delete">
  <Button variant="destructive" onClick={handleDelete}>
    Supprimer
  </Button>
</ProtectedAction>

// Avec fallback (message alternatif pour les VIEWERS)
<ProtectedAction
  action="write"
  fallback={<p className="text-muted-foreground">Accès restreint</p>}
>
  <Button>Modifier</Button>
</ProtectedAction>

// Avec skeleton de chargement
<ProtectedAction action="write" showLoadingSkeleton>
  <Button>Créer</Button>
</ProtectedAction>
```

#### Composant `ViewerMessage`

Affiche un message informatif uniquement aux VIEWERS :

```typescript
import { ViewerMessage } from '@/components/admin/ProtectedAction';

<ViewerMessage message="Vous avez un accès en lecture seule. Contactez un administrateur pour modifier ces données." />
```

## Fonctions Utilitaires (lib/auth.ts)

### Côté Serveur

```typescript
import {
  getUserRole,
  isViewer,
  isAdmin,
  isSuperAdmin,
  requireWritePermission,
  requireDeletePermission,
  requireAdmin,
  requireSuperAdmin,
} from '@/lib/auth';

// Récupérer le rôle
const role = await getUserRole(); // 'viewer' | 'admin' | 'super_admin' | null

// Vérifications booléennes
const viewerCheck = await isViewer(); // true/false
const adminCheck = await isAdmin(); // true/false
const superAdminCheck = await isSuperAdmin(); // true/false

// Vérifications avec exception (throw AuthError si échoue)
await requireWritePermission(); // Bloque les VIEWERS
await requireDeletePermission(); // Bloque les VIEWERS
await requireAdmin(); // Bloque les VIEWERS
await requireSuperAdmin(); // Bloque VIEWERS et ADMINS
```

## Exemples d'Implémentation

### Page de Liste avec Actions

```typescript
'use client';

import { ProtectedAction, ViewerMessage } from '@/components/admin/ProtectedAction';
import { useUserRole } from '@/hooks/use-user-role';

export default function JobsPage() {
  const { isViewer } = useUserRole();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Offres d'emploi</h1>

        {/* Bouton Créer - masqué pour les VIEWERS */}
        <ProtectedAction action="write">
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle offre
          </Button>
        </ProtectedAction>
      </div>

      {/* Message pour les VIEWERS */}
      <ViewerMessage message="Vous consultez les offres d'emploi en lecture seule." />

      {/* Liste des jobs */}
      <Table>
        {/* ... */}
        <TableRow>
          <TableCell>{job.title}</TableCell>
          <TableCell>
            {/* Actions - masquées pour les VIEWERS */}
            <ProtectedAction action="write">
              <Button variant="ghost" onClick={() => handleEdit(job.id)}>
                Modifier
              </Button>
            </ProtectedAction>

            <ProtectedAction action="delete">
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() => handleDelete(job.id)}
              >
                Supprimer
              </Button>
            </ProtectedAction>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
}
```

### Formulaire de Modification

```typescript
'use client';

import { ProtectedAction } from '@/components/admin/ProtectedAction';

export default function EditJobForm({ jobId }: { jobId: number }) {
  const { isViewer } = useUserRole();

  return (
    <Form>
      {/* Champs du formulaire - peuvent être disabled pour les VIEWERS */}
      <Input
        name="title"
        disabled={isViewer}
        placeholder="Titre de l'offre"
      />

      {/* Boutons d'action - masqués pour les VIEWERS */}
      <div className="flex gap-2">
        <ProtectedAction
          action="write"
          fallback={
            <p className="text-sm text-muted-foreground">
              Seuls les administrateurs peuvent modifier cette offre.
            </p>
          }
        >
          <Button type="submit">Enregistrer</Button>
          <Button variant="outline" type="button">
            Annuler
          </Button>
        </ProtectedAction>
      </div>
    </Form>
  );
}
```

## Sécurité

### Double Protection

Le système utilise une **double protection** :

1. **Côté Serveur** : Les actions sont bloquées par les middlewares `writeAction` et `deleteAction`
   - Même si un utilisateur malveillant contourne l'interface, l'action sera refusée côté serveur
   - Retourne une erreur explicite : "Vous n'avez pas la permission de modifier"

2. **Côté Client** : Les boutons sont masqués pour une meilleure expérience utilisateur
   - Évite la frustration de cliquer sur un bouton qui sera refusé
   - Interface claire et adaptée au rôle

### Messages d'Erreur

Quand un VIEWER tente une action interdite :

```
❌ Erreur: Vous n'avez pas la permission de modifier. Seuls les administrateurs peuvent effectuer cette action.
```

## Migration des Pages Existantes

Pour protéger une page existante :

1. **Importer les composants** :
```typescript
import { ProtectedAction, ViewerMessage } from '@/components/admin/ProtectedAction';
```

2. **Envelopper les boutons d'action** :
```typescript
// Avant
<Button onClick={handleCreate}>Créer</Button>

// Après
<ProtectedAction action="write">
  <Button onClick={handleCreate}>Créer</Button>
</ProtectedAction>
```

3. **Ajouter un message pour les VIEWERS** (optionnel) :
```typescript
<ViewerMessage message="Vous avez un accès en lecture seule à cette section." />
```

4. **Vérifier les actions serveur** :
```typescript
// Remplacer adminAction par writeAction pour CREATE/UPDATE
export const createJob = writeAction // ✅ au lieu de adminAction
  .metadata({ actionName: "create-job" })
  .schema(createJobSchema)
  .action(async ({ parsedInput }) => { /* ... */ });
```

## Résumé

✅ **VIEWERS peuvent** :
- Se connecter à l'admin
- Voir toutes les données (jobs, blog, events, CRM, etc.)
- Naviguer dans toutes les sections
- Exporter des données (si applicable)

❌ **VIEWERS ne peuvent pas** :
- Créer de nouveaux éléments
- Modifier des éléments existants
- Supprimer des éléments
- Changer les statuts ou paramètres

🔒 **Protection** :
- Côté serveur : Middlewares `writeAction` et `deleteAction`
- Côté client : Composant `ProtectedAction` et hook `useUserRole`
