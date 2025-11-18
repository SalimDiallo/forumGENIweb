# Configuration de l'authentification Admin

Ce projet utilise [Better Auth](https://www.better-auth.com/) pour l'authentification des administrateurs.

## 📋 Fichiers créés

### Configuration

- `/lib/auth.ts` - Configuration serveur de Better Auth
- `/lib/auth-client.ts` - Client Better Auth pour le côté client
- `/app/api/auth/[...all]/route.ts` - Routes API pour Better Auth

### Interface

- `/app/admin/login/page.tsx` - Page de connexion administrateur

### Scripts

- `/scripts/create-admin.ts` - Script pour créer un utilisateur administrateur

## 🚀 Mise en place

### 1. Mettre à jour le schéma Prisma

Better Auth nécessite des tables spécifiques. Le schéma Prisma existant avec `AdminUser` et `AdminSession` doit être compatible.

Pour que Better Auth fonctionne correctement, vous devez :

**Option A : Utiliser les tables Better Auth par défaut**

Better Auth créera automatiquement les tables `user`, `session`, `account` et `verification`. Exécutez :

```bash
npx prisma db push
```

**Option B : Adapter le schéma existant**

Vous pouvez configurer Better Auth pour utiliser vos tables existantes en modifiant `/lib/auth.ts`.

### 2. Créer un utilisateur administrateur

Exécutez le script de création d'admin :

```bash
npx tsx scripts/create-admin.ts
```

Cela créera un administrateur avec :
- **Email** : admin@forumgenie.com
- **Mot de passe** : Admin123!
- **Rôle** : super_admin

⚠️ **IMPORTANT** : Changez ce mot de passe après la première connexion !

### 3. Se connecter

Accédez à `/admin/login` et connectez-vous avec les identifiants ci-dessus.

## 🔐 Fonctionnalités

### Authentification

- ✅ Connexion par email/mot de passe
- ✅ Sessions sécurisées (7 jours d'expiration)
- ✅ Gestion des rôles (editor, admin, super_admin)
- ✅ Protection des routes admin
- ✅ Cookies sécurisés avec préfixe `admin-auth`

### Helpers d'authentification

```typescript
import { getSession, isAdmin, requireAdmin } from "@/lib/auth";

// Côté serveur
const session = await getSession();
const admin = await isAdmin();
const adminSession = await requireAdmin(); // Lance une erreur si pas admin
```

### Client React

```typescript
import { useSession, signIn, signOut } from "@/lib/auth-client";

// Dans un composant
const { data: session, isPending } = useSession();

// Connexion
await signIn.email({ email, password });

// Déconnexion
await signOut();
```

## 🛡️ Sécurité

- Hash de mots de passe avec PBKDF2
- Sessions avec expiration automatique
- Protection CSRF intégrée
- Cookies HTTP-only et Secure en production

## 📝 Variables d'environnement

Ajoutez dans `.env` :

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

En production, changez l'URL vers votre domaine.

## 🔧 Personnalisation

### Modifier la durée de session

Dans `/lib/auth.ts` :

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 jours
  updateAge: 60 * 60 * 24, // 1 jour
}
```

### Ajouter des champs utilisateur

Dans `/lib/auth.ts`, section `user.additionalFields` :

```typescript
additionalFields: {
  customField: {
    type: "string",
    required: false,
  },
}
```

## 🐛 Dépannage

### Erreur "Table not found"

Exécutez `npx prisma db push` pour créer les tables.

### Session non persistante

Vérifiez que `NEXT_PUBLIC_BASE_URL` est correctement défini.

### Erreur de hash de mot de passe

Le script `create-admin.ts` utilise l'algorithme de hash par défaut. Assurez-vous que Better Auth utilise le même algorithme.

## 📚 Documentation

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth avec Prisma](https://www.better-auth.com/docs/integrations/prisma)
- [Better Auth avec Next.js](https://www.better-auth.com/docs/integrations/nextjs)
