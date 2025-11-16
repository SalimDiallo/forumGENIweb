# Configuration Google Drive pour la Galerie

Ce guide vous explique comment configurer l'intégration Google Drive pour la galerie du site Forum GENI × INSEA.

## Structure des dossiers dans Google Drive

La galerie s'attend à une structure spécifique dans votre Google Drive :

```
📁 Galerie GENI (Dossier racine)
├── 📁 2025
│   ├── 📁 Forum
│   │   ├── 📁 Forum Spring 2025
│   │   │   ├── 🖼️ image1.jpg
│   │   │   ├── 🖼️ image2.png
│   │   │   └── 🎬 video1.mp4
│   │   └── 📁 Forum Automne 2025
│   │       └── ...
│   ├── 📁 Workshop
│   │   └── 📁 Workshop IA 2025
│   │       └── ...
│   └── 📁 Networking
│       └── ...
└── 📁 2024
    └── ...
```

### Hiérarchie :
1. **Dossier racine** : Galerie GENI (ou tout autre nom)
2. **Année** : 2025, 2024, 2023, etc.
3. **Catégorie** : Forum, Workshop, Networking, Conférence, etc.
4. **Événement** : Nom de l'événement spécifique
5. **Médias** : Images et vidéos (fichiers)

### Formats supportés :

**Images :**
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

**Vidéos :**
- MP4
- QuickTime (MOV)
- AVI
- MKV
- WebM

---

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le **Project ID**

## Étape 2 : Activer l'API Google Drive

1. Dans la console Google Cloud, allez dans **APIs & Services** > **Library**
2. Recherchez **Google Drive API**
3. Cliquez sur **Enable**

## Étape 3 : Créer un Service Account

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **Service Account**
3. Remplissez les informations :
   - **Service account name** : `forum-geni-gallery` (ou autre nom)
   - **Service account description** : "Service account pour la galerie du site Forum GENI"
4. Cliquez sur **Create and Continue**
5. Pour le rôle, sélectionnez **Viewer** (lecture seule suffit)
6. Cliquez sur **Done**

## Étape 4 : Générer une clé JSON

1. Dans la liste des Service Accounts, cliquez sur celui que vous venez de créer
2. Allez dans l'onglet **Keys**
3. Cliquez sur **Add Key** > **Create new key**
4. Sélectionnez **JSON**
5. Cliquez sur **Create**
6. Un fichier JSON sera téléchargé automatiquement - **GARDEZ-LE EN SÉCURITÉ !**

Le fichier ressemble à ceci :
```json
{
  "type": "service_account",
  "project_id": "votre-project-id",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "forum-geni-gallery@votre-project.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "xxx"
}
```

## Étape 5 : Partager le dossier Google Drive

1. Dans Google Drive, créez votre structure de dossiers (voir structure ci-dessus)
2. Faites un clic droit sur le **dossier racine** (Galerie GENI)
3. Cliquez sur **Partager**
4. Ajoutez l'email du Service Account que vous avez créé :
   - L'email se trouve dans le fichier JSON : `client_email`
   - Exemple : `forum-geni-gallery@votre-project.iam.gserviceaccount.com`
5. Donnez-lui les droits **Lecteur** (Viewer)
6. Cliquez sur **Partager**

## Étape 6 : Récupérer l'ID du dossier

1. Ouvrez le dossier racine dans Google Drive
2. L'URL ressemble à : `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz`
3. L'ID du dossier est la partie après `/folders/` : `1AbCdEfGhIjKlMnOpQrStUvWxYz`
4. Copiez cet ID

## Étape 7 : Configuration des variables d'environnement

1. Ouvrez le fichier `.env` à la racine du projet
2. Ajoutez ces deux variables :

```env
# Google Drive API Configuration
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...COLLEZ_TOUT_LE_CONTENU_DU_JSON_ICI..."}'

GOOGLE_DRIVE_GALLERY_FOLDER_ID="1AbCdEfGhIjKlMnOpQrStUvWxYz"
```

### Important :
- Pour `GOOGLE_SERVICE_ACCOUNT_KEY` : **Collez tout le contenu du fichier JSON** sur une seule ligne entre les guillemets simples
- Pour `GOOGLE_DRIVE_GALLERY_FOLDER_ID` : Collez l'ID du dossier racine que vous avez copié

### Exemple complet :

```env
DATABASE_URL="file:./dev.db"

GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"forum-geni-123456","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n","client_email":"forum-geni-gallery@forum-geni-123456.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/forum-geni-gallery%40forum-geni-123456.iam.gserviceaccount.com"}'

GOOGLE_DRIVE_GALLERY_FOLDER_ID="1AbCdEfGhIjKlMnOpQrStUvWxYz"

NEXT_PUBLIC_PUBLISHABLE_KEY="your-key"
```

## Étape 8 : Tester

1. Redémarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Accédez à la page galerie : `http://localhost:3000/gallery`

3. Vous devriez voir vos images et vidéos organisées par année, catégorie et événement !

---

## Dépannage

### Erreur : "GOOGLE_DRIVE_GALLERY_FOLDER_ID is not configured"
- Vérifiez que la variable est bien définie dans `.env`
- Redémarrez le serveur après avoir modifié `.env`

### Erreur : "Failed to initialize Google Drive client"
- Vérifiez que le JSON du Service Account est valide
- Assurez-vous qu'il n'y a pas d'erreur de syntaxe (guillemets, virgules)

### La galerie est vide
- Vérifiez que le dossier a bien été partagé avec le Service Account
- Vérifiez que l'ID du dossier est correct
- Vérifiez que vos fichiers sont dans les formats supportés
- Regardez les logs du serveur pour plus de détails

### Les images ne s'affichent pas
- Google Drive nécessite que les fichiers soient accessibles
- Vérifiez que le Service Account a bien les droits de lecture
- Certains navigateurs peuvent bloquer le contenu Google Drive - testez dans un autre navigateur

---

## Sécurité

⚠️ **Important** :
- Ne commitez **JAMAIS** le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Ne partagez jamais votre clé de Service Account
- Utilisez des variables d'environnement séparées pour la production

Pour la production, utilisez les secrets de votre plateforme d'hébergement (Vercel, Netlify, etc.) pour stocker ces variables de manière sécurisée.

---

## Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs du serveur
2. La structure des dossiers dans Drive
3. Les permissions du Service Account
4. La validité du JSON dans `.env`
