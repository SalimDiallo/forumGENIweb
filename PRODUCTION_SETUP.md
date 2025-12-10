# 🚀 Guide de Déploiement en Production

## Problèmes Résolus

### ✅ Corrections Appliquées

1. **Provider de base de données corrigé** (`lib/auth.ts:18`)
   - Avant : `provider: "sqlite"`
   - Après : `provider: "postgresql"` ✓

2. **URLs de base synchronisées** (`lib/auth.ts:62`)
   - Avant : serveur `localhost:3001` ≠ client `localhost:3000`
   - Après : serveur et client utilisent `localhost:3000` ✓

3. **Délai de redirection augmenté** (`app/admin/login/page.tsx:46-48`)
   - Avant : 1000ms (1 seconde)
   - Après : 2000ms (2 secondes) ✓

4. **Configuration explicite des cookies** (`lib/auth.ts:60-64`)
   - Ajout de `sameSite: "lax"`
   - Ajout de `httpOnly: true`
   - `secure` activé uniquement en production ✓

---

## 📋 Checklist de Déploiement Production

### 1. Variables d'Environnement CRITIQUES

**⚠️ IMPORTANT** : Ces variables DOIVENT être configurées dans votre plateforme de déploiement (Vercel, Netlify, etc.)

```bash
# Base URL - CRITIQUE !
# Remplacez par votre domaine de production EXACT
NEXT_PUBLIC_BASE_URL="https://votre-domaine.com"

# Base de données PostgreSQL (Neon)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Secret Better Auth
# Générez avec: openssl rand -base64 32
BETTER_AUTH_SECRET="votre-secret-ici"

# Autres variables existantes
NEXT_PUBLIC_PUBLISHABLE_KEY="..."
GOOGLE_SERVICE_ACCOUNT_KEY='...'
GOOGLE_DRIVE_GALLERY_FOLDER_ID="..."
YOUTUBE_API_KEY="..."
YOUTUBE_CHANNEL_ID="..."
REVALIDATE_TOKEN="..."
```

### 2. Vérifications Avant Déploiement

- [ ] `NEXT_PUBLIC_BASE_URL` est défini avec le domaine de production EXACT (avec `https://`)
- [ ] `BETTER_AUTH_SECRET` est généré et configuré
- [ ] `DATABASE_URL` pointe vers PostgreSQL Neon (pas SQLite)
- [ ] Le certificat HTTPS est actif sur votre domaine
- [ ] Les migrations Prisma sont appliquées : `npx prisma migrate deploy`
- [ ] Le script `create-admin.ts` a créé le super admin

### 3. Commandes de Build

Le script `package.json` exécute automatiquement :

```bash
npm run build
# Équivalent à :
# prisma generate && prisma migrate deploy && tsx scripts/create-admin.ts && next build
```

Lors du déploiement sur Vercel, utilisez :
```bash
npm run vercel-build
```

### 4. Test Post-Déploiement

Après le déploiement, testez dans cet ordre :

1. **Vérifier les cookies** (DevTools > Application > Cookies)
   - Recherchez `admin-auth.session_token`
   - Vérifiez que `Secure` = true
   - Vérifiez que `SameSite` = Lax
   - Vérifiez que `HttpOnly` = true

2. **Test de connexion**
   - Allez sur `https://votre-domaine.com/admin/login`
   - Connectez-vous avec vos identifiants super admin
   - Après 2 secondes, vous devriez être redirigé vers `/admin`
   - Vérifiez que vous n'êtes PAS redirigé vers `/admin/login`

3. **Test de session**
   - Naviguez entre les pages admin
   - Rafraîchissez la page (F5)
   - Vous devriez rester connecté

4. **Test de déconnexion**
   - Déconnectez-vous
   - Vérifiez que vous êtes redirigé vers `/admin/login`
   - Vérifiez que le cookie `admin-auth.session_token` est supprimé

---

## 🔧 Dépannage

### Problème : L'utilisateur reste bloqué sur `/admin/login`

**Causes possibles :**

1. **`NEXT_PUBLIC_BASE_URL` mal configuré**
   - ✅ Solution : Vérifiez que la variable d'environnement est EXACTEMENT votre domaine de production
   - Exemple : `NEXT_PUBLIC_BASE_URL=https://forum-genie.com` (sans slash final)

2. **Certificat HTTPS invalide**
   - ✅ Solution : Vérifiez que votre domaine a un certificat SSL/TLS valide
   - Test : Ouvrez `https://votre-domaine.com` et vérifiez l'icône de cadenas

3. **Cookies bloqués**
   - ✅ Solution : Vérifiez les DevTools Console pour les erreurs de cookies
   - Vérifiez que `SameSite=Lax` et `Secure=true` sont compatibles avec votre configuration

4. **Cache navigateur**
   - ✅ Solution : Videz le cache et les cookies du navigateur
   - Ou testez en mode navigation privée

### Problème : Erreur "Database provider mismatch"

**Cause :** Mauvais provider dans `lib/auth.ts`

**Solution :** Vérifiez que `provider: "postgresql"` dans le fichier `lib/auth.ts:18`

### Problème : Session expire immédiatement

**Cause :** Problème de synchronisation d'horloge ou de configuration de session

**Solution :**
1. Vérifiez que l'horloge du serveur est synchronisée
2. Vérifiez la configuration de session dans `lib/auth.ts:24-31`

---

## 📊 Configuration de Session Actuelle

```typescript
session: {
  expiresIn: 60 * 60 * 24 * 7,      // 7 jours
  updateAge: 60 * 60 * 24,           // 1 jour
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,                  // 5 minutes
  },
}
```

---

## 🔐 Sécurité

### Cookies Sécurisés

En production (`NODE_ENV=production`) :
- ✅ `Secure` = true (HTTPS requis)
- ✅ `HttpOnly` = true (protection XSS)
- ✅ `SameSite` = Lax (protection CSRF)

### Recommandations

1. **HTTPS obligatoire** : Ne déployez jamais sans HTTPS
2. **Secrets forts** : Utilisez `openssl rand -base64 32` pour générer les secrets
3. **Variables d'environnement** : Ne commitez JAMAIS les fichiers `.env`
4. **Monitoring** : Surveillez les logs d'authentification

---

## 📞 Support

Si le problème persiste après ces vérifications :

1. Vérifiez les logs de votre plateforme de déploiement
2. Inspectez les Network requests dans DevTools
3. Vérifiez les erreurs dans la Console navigateur
4. Testez l'API directement : `GET https://votre-domaine.com/api/auth/session`

---

**Date de création :** 2025-12-10
**Dernière mise à jour :** 2025-12-10
