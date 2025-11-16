# ⚡ Configuration Rapide Google Drive

## 🎯 Objectif
Connecter votre Google Drive à la galerie pour afficher automatiquement vos photos et vidéos.

---

## 📝 Checklist (5 étapes principales)

### ✅ Étape 1 : Google Cloud Console
1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet : "Forum GENI Gallery"
3. Menu : **APIs & Services** > **Library**
4. Recherchez et activez : **Google Drive API**

### ✅ Étape 2 : Service Account
1. Menu : **APIs & Services** > **Credentials**
2. **+ CREATE CREDENTIALS** > **Service account**
3. Nom : `forum-geni-gallery`
4. Rôle : **Viewer** (Lecteur)
5. Terminez la création

### ✅ Étape 3 : Clé JSON
1. Cliquez sur votre Service Account créé
2. Onglet **KEYS** > **ADD KEY** > **Create new key**
3. Format : **JSON**
4. Téléchargez le fichier (ex: `forum-geni-abc123.json`)
5. **IMPORTANT** : Ouvrez ce fichier et copiez **TOUT** son contenu

### ✅ Étape 4 : Google Drive
1. Dans Google Drive, créez cette structure :
```
📁 Galerie GENI
├── 📁 2025
│   ├── 📁 Forum
│   │   └── 📁 Forum Test 2025
│   │       └── 🖼️ photo.jpg
│   └── 📁 Workshop
└── 📁 2024
```

2. **Partagez le dossier "Galerie GENI"** :
   - Clic droit > Partager
   - Collez l'email du Service Account (trouvé dans le JSON, ligne `"client_email"`)
   - Rôle : **Lecteur**
   - Partagez

3. **Récupérez l'ID du dossier** :
   - Ouvrez "Galerie GENI"
   - URL : `https://drive.google.com/drive/folders/1AbCd...`
   - Copiez la partie après `/folders/` : `1AbCd...`

### ✅ Étape 5 : Configuration .env

Ouvrez le fichier `.env` et ajoutez :

```env
# Vos variables existantes
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_PUBLISHABLE_KEY="your-key"

# NOUVELLES VARIABLES À AJOUTER :

# 1. Collez TOUT le contenu du fichier JSON téléchargé entre les guillemets simples
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'

# 2. Collez l'ID du dossier copié
GOOGLE_DRIVE_GALLERY_FOLDER_ID="1AbCdEfGhIjKlMnOpQrStUvWxYz"
```

---

## 🧪 Tester la Configuration

Avant de démarrer le serveur, testez votre configuration :

```bash
node scripts/test-drive-connection.mjs
```

Si tout est OK, vous verrez :
```
✅ TOUS LES TESTS SONT PASSÉS!
🎉 Votre configuration Google Drive est correcte!
```

---

## 🚀 Démarrer

```bash
npm run dev
```

Visitez : http://localhost:3000/gallery

---

## ❌ Problèmes Courants

### "GOOGLE_SERVICE_ACCOUNT_KEY n'est pas défini"
→ Vérifiez que vous avez bien ajouté la variable dans `.env`

### "Le dossier n'existe pas ou n'est pas partagé"
→ Assurez-vous d'avoir partagé le dossier avec l'email du Service Account

### "JSON invalide"
→ Vérifiez que vous avez copié TOUT le contenu du fichier JSON (de `{` à `}`)

### La galerie est vide
→ Vérifiez la structure des dossiers : Année > Catégorie > Événement > Fichiers

---

## 📚 Documentation Complète

Pour plus de détails, consultez : `docs/GOOGLE_DRIVE_SETUP.md`

---

## 🔒 Sécurité

- ❌ Ne commitez JAMAIS le fichier `.env`
- ❌ Ne partagez JAMAIS votre clé JSON
- ✅ Le fichier `.env` est déjà dans `.gitignore`
