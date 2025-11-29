# Configuration de la Galerie

La galerie combine deux sources de médias :
- **Images** : depuis Google Drive
- **Vidéos** : depuis YouTube

## 📋 Prérequis

### 1. Google Drive (pour les images)

#### Créer un compte de service Google
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google Drive :
   - Aller dans "APIs & Services" > "Library"
   - Rechercher "Google Drive API"
   - Cliquer sur "Enable"
4. Créer un compte de service :
   - Aller dans "APIs & Services" > "Credentials"
   - Cliquer sur "Create Credentials" > "Service Account"
   - Donner un nom au compte (ex: "gallery-service")
   - Cliquer sur "Create and Continue"
   - Passer les permissions (optionnel)
   - Cliquer sur "Done"
5. Créer une clé pour le compte de service :
   - Cliquer sur le compte de service créé
   - Aller dans l'onglet "Keys"
   - Cliquer sur "Add Key" > "Create new key"
   - Sélectionner "JSON"
   - Télécharger le fichier JSON

#### Configurer Google Drive
1. Créer un dossier racine pour la galerie dans Google Drive
2. Organiser vos images par événement :
   ```
   Galerie/
   ├── Forum Spring 2025 - Conférence - 2025/
   │   ├── image1.jpg
   │   ├── image2.jpg
   │   └── ...
   ├── Atelier Innovation - Workshop - 2024/
   │   ├── photo1.jpg
   │   └── ...
   └── ...
   ```

   **Format du nom de dossier** :
   - Format complet : `"Nom de l'événement - Catégorie - Année"`
   - Format court : `"Nom de l'événement"` (l'année sera extraite du nom si possible)
   - Exemples :
     - ✅ `Forum Spring 2025 - Conférence - 2025`
     - ✅ `Atelier Innovation 2024 - Workshop - 2024`
     - ✅ `Forum Spring 2025` (l'année sera détectée automatiquement)

3. Partager le dossier avec le compte de service :
   - Faire un clic droit sur le dossier racine
   - Cliquer sur "Partager"
   - Ajouter l'email du compte de service (trouvé dans le fichier JSON : `client_email`)
   - Donner les permissions "Lecteur" (Viewer)
   - Cliquer sur "Envoyer"

4. Récupérer l'ID du dossier :
   - Ouvrir le dossier dans Google Drive
   - L'URL ressemble à : `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXX`
   - L'ID est la partie après `/folders/` : `XXXXXXXXXXXXXXXX`

### 2. YouTube (pour les vidéos)

#### Créer une clé API YouTube
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Utiliser le même projet que pour Google Drive (ou créer un nouveau)
3. Activer l'API YouTube Data v3 :
   - Aller dans "APIs & Services" > "Library"
   - Rechercher "YouTube Data API v3"
   - Cliquer sur "Enable"
4. Créer une clé API :
   - Aller dans "APIs & Services" > "Credentials"
   - Cliquer sur "Create Credentials" > "API Key"
   - Copier la clé générée
   - (Optionnel) Restreindre la clé :
     - Cliquer sur "Edit API key"
     - Dans "API restrictions", sélectionner "Restrict key"
     - Cocher "YouTube Data API v3"
     - Sauvegarder

#### Récupérer l'ID de votre chaîne YouTube
1. Méthode 1 - Via YouTube Studio :
   - Aller sur [YouTube Studio](https://studio.youtube.com/)
   - Cliquer sur "Paramètres" (Settings)
   - Aller dans "Chaîne" (Channel) > "Informations avancées" (Advanced settings)
   - Copier l'ID de la chaîne

2. Méthode 2 - Via URL :
   - Ouvrir votre chaîne YouTube
   - Si l'URL contient `/channel/`, l'ID est la partie après : `https://www.youtube.com/channel/UCXXXXXXXXXXXXXXXX`
   - Si l'URL contient `/@username`, utiliser un outil comme [Comment Picker](https://commentpicker.com/youtube-channel-id.php)

#### Organiser vos vidéos YouTube
Pour que les vidéos soient correctement catégorisées dans la galerie, utilisez les **descriptions** de vos vidéos avec des hashtags :

**Format recommandé** :
```
Description de votre vidéo...

#NomÉvénement #Catégorie #2025
```

**Exemples** :
```
Belle vidéo du Forum Spring 2025

#ForumSpring2025 #Conférence #2025
```

```
Atelier sur l'innovation digitale

#AtelierInnovation #Workshop #2024
```

**Hashtags reconnus automatiquement** :
- `#forum`, `#conference`, `#workshop`, `#atelier`, `#séminaire`, `#webinar` → Catégorisés automatiquement
- L'année (format `#2024`, `#2025`, etc.)
- Les autres hashtags sont utilisés comme nom d'événement

## ⚙️ Configuration des variables d'environnement

### 1. Copier le fichier d'exemple
```bash
cp .env.example .env
```

### 2. Remplir les variables

#### Google Drive (Images)
```env
# Copier tout le contenu du fichier JSON téléchargé
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'

# ID du dossier racine de la galerie
GOOGLE_DRIVE_GALLERY_FOLDER_ID="1a2b3c4d5e6f7g8h9i0j"
```

#### YouTube (Vidéos)
```env
# Clé API YouTube Data v3
YOUTUBE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX"

# ID de votre chaîne YouTube
YOUTUBE_CHANNEL_ID="UCXXXXXXXXXXXXXXXX"
```

#### Autres variables
```env
# Token pour revalider le cache manuellement (générer avec : openssl rand -base64 32)
REVALIDATE_TOKEN="votre-token-secret-ici"

# Clé publique de l'application
NEXT_PUBLIC_PUBLISHABLE_KEY="votre-cle-publique"
```

## 🚀 Tester la configuration

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

### 3. Accéder à la galerie
Ouvrir [http://localhost:3000/gallery](http://localhost:3000/gallery)

### 4. Vérifier les logs
- Les images de Google Drive devraient s'afficher
- Les vidéos YouTube devraient apparaître avec le badge "YouTube"
- Vérifier la console du navigateur pour d'éventuelles erreurs

## 🔄 Revalider le cache

Le cache est automatiquement revalidé toutes les heures (3600 secondes).

Pour forcer une revalidation immédiate :
```bash
curl -X POST "http://localhost:3000/api/revalidate/gallery?token=VOTRE_REVALIDATE_TOKEN"
```

## 📝 Structure finale

```
Galerie
├── Images (Google Drive)
│   ├── Organisées par dossiers d'événements
│   └── Format : "Événement - Catégorie - Année"
│
└── Vidéos (YouTube)
    ├── Toutes les vidéos de la chaîne
    └── Métadonnées extraites des descriptions (hashtags)
```

## 🐛 Dépannage

### Les images Google Drive ne s'affichent pas
1. Vérifier que le compte de service a bien les permissions "Lecteur" sur le dossier
2. Vérifier que `GOOGLE_SERVICE_ACCOUNT_KEY` est correctement formaté (JSON valide)
3. Vérifier que l'API Google Drive est activée
4. Regarder les logs du serveur pour plus de détails

### Les vidéos YouTube ne s'affichent pas
1. Vérifier que `YOUTUBE_API_KEY` est valide
2. Vérifier que l'API YouTube Data v3 est activée
3. Vérifier que `YOUTUBE_CHANNEL_ID` correspond bien à votre chaîne
4. Vérifier les quotas de l'API YouTube (limite : 10,000 unités/jour)
5. Regarder les logs du serveur pour plus de détails

### Les vidéos ne sont pas catégorisées correctement
1. Vérifier le format des hashtags dans les descriptions YouTube
2. S'assurer que les hashtags contiennent l'année (ex: `#2025`)
3. Utiliser des hashtags de catégorie reconnus (`#forum`, `#conference`, etc.)

## 📊 Limites et quotas

### Google Drive API
- Limites par utilisateur par projet : 1,000 requêtes/100 secondes
- Le code utilise un batch processor pour limiter les requêtes parallèles (max 10)
- Cache de 1 heure pour réduire les appels API

### YouTube Data API v3
- Quota par défaut : 10,000 unités par jour
- 1 requête de liste de vidéos = ~1-3 unités
- Cache de 1 heure pour réduire les appels API
- Si vous dépassez le quota, augmentez-le via Google Cloud Console

## 🔐 Sécurité

- ⚠️ **Ne jamais committer les fichiers `.env` ou les clés API**
- Ajouter `.env` dans `.gitignore`
- Utiliser des variables d'environnement séparées pour production
- Restreindre les clés API aux services nécessaires uniquement
- Utiliser des permissions minimales pour le compte de service Google

## 📚 Ressources utiles

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Comment Picker - YouTube Channel ID Finder](https://commentpicker.com/youtube-channel-id.php)
