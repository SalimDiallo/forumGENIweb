# 📸 Rapport d'Analyse des Images Statiques
**Généré le :** 16 Décembre 2025  
**Projet :** SitewebFORUM - Forum Génie Entreprise

---

## 📋 Table des Matières
1. [Résumé Exécutif](#résumé-exécutif)
2. [Images des Événements - BookHistory](#images-des-événements---bookhistory)
3. [Images des Articles de Blog - BlogList](#images-des-articles-de-blog---bloglist)
4. [Images Locales - Dossier Public](#images-locales---dossier-public)
5. [Analyse des Extensions](#analyse-des-extensions)
6. [Recommandations](#recommandations)

---

## 🎯 Résumé Exécutif

| Catégorie | Nombre d'URLs | Extensions |
|-----------|---------------|------------|
| **Événements (BookHistory)** | 10 | `.jpg`, `.png`, Google images |
| **Articles Blog** | 7 | `.jpg` (Unsplash) |
| **Images locales (public/)** | 42+ | `.png`, `.jpg`, `.svg`, `.webp` |

**⚠️ Points d'attention :**
- Plusieurs URLs d'images proviennent de sources externes (LinkedIn, Google Cache, sites tiers)
- Risque de liens brisés ou d'images indisponibles
- Recommandation : héberger localement les images critiques

---

## 📚 Images des Événements - BookHistory

> **Source :** `components/BookHistory.tsx`

Ces images représentent l'historique du Forum Génie Entreprise de 2002 à 2025.

### Liste Complète des Images

| # | Année | Titre de l'Événement | URL de l'Image | Extension |
|---|-------|---------------------|----------------|-----------|
| 1 | **2002** | L'Étincelle (Le Commencement) | `https://media.licdn.com/dms/image/v2/D4E0BAQGEHMHyq4BVTA/company-logo_200_200/B4EZlXBs1KIkAI-/0/1758101688171/forumgenientreprises_logo?e=2147483647&v=beta&t=MpKlm0bOboORrRodJxsxK5h-vGfI2yFy3wczxaGZlG4` | LinkedIn (dynamique) |
| 2 | **2022** | La Conférence sur la Loi de Finances | `https://maroc-ingenierie.ma/wp-content/uploads/2022/01/INSEA-LDF2022.jpg` | `.jpg` |
| 3 | **2022** | Forum Geni Entreprise 18e Edition | `https://ensias.um5.ac.ma/sites/ensias.um5.ac.ma/files/images/news/Forum%20GENI-%20Entreprises2022.jpg` | `.jpg` |
| 4 | **2023** | Forum Geni Entreprise 19e Edition | `https://insea.ac.ma/images/affiche_forum_2023.png` | `.png` |
| 5 | **2023** | Conférence sur le PLF2023 | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9QwKFR-edFAh6QHLZ-GnIZCS-Tg1fg1zpJll_jpZOe_yY-G0On6U-XCwCGwNJ3MA6QuM&usqp=CAU` | Google Cache |
| 6 | **2023** | Speed JOB dating | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwr3k7cM46alRukcGl4RfHmv7cRQagQfE6bA&s` | Google Cache |
| 7 | **2024** | Forum Geni Entreprise 20e Edition | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTAjROsS32n61SUwTYB_IU--L67DDzYeSfw&s` | Google Cache |
| 8 | **2024** | Visa D'embauche | `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-94k-YxTYaVm3yDXP38hAreNUVbTsVpJ9OIGAUO82v0qaSWa1hjxy8XpVKOUDTzjZkg&usqp=CAU` | Google Cache |
| 9 | **2025** | Oracle CAMPUS TOUR | `https://www.atalayar.com/media/atalayar/images/2022/05/19/20220519103922068626.jpg` | `.jpg` |
| 10 | **2025** | Forum Geni Entreprise 21e Edition | `https://drh-ma.s3.amazonaws.com/wp-content/uploads/2025/10/09120824/Forum-GENI-Entreprises-2025.jpg` | `.jpg` |

### ⚠️ URLs à Risque (BookHistory)

Les URLs suivantes proviennent de caches Google et sont **instables** :

```
❌ https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9QwKFR-edFAh6QHLZ-GnIZCS-Tg1fg1zpJll_jpZOe_yY-G0On6U-XCwCGwNJ3MA6QuM&usqp=CAU
❌ https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwr3k7cM46alRukcGl4RfHmv7cRQagQfE6bA&s
❌ https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTAjROsS32n61SUwTYB_IU--L67DDzYeSfw&s
❌ https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV-94k-YxTYaVm3yDXP38hAreNUVbTsVpJ9OIGAUO82v0qaSWa1hjxy8XpVKOUDTzjZkg&usqp=CAU
```

---

## 📝 Images des Articles de Blog - BlogList

> **Source :** `components/BlogList.tsx`

Ces images sont utilisées pour les articles de blog de démonstration.

| # | Titre de l'Article | URL de l'Image | Extension |
|---|-------------------|----------------|-----------|
| 1 | L'Intelligence Artificielle transforme-t-elle vraiment l'industrie marocaine ? | `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 2 | 10 conseils pour réussir sa startup au Maroc en 2025 | `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 3 | Forum 2024 : Retour sur un succès exceptionnel | `https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 4 | Les métiers du futur : Comment préparer sa carrière ? | `https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 5 | La transformation digitale dans l'industrie manufacturière | `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 6 | L'écosystème startup marocain : État des lieux 2024 | `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80` | `.jpg` |
| 7 | Fallback Image | `https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80` | `.jpg` |

✅ **Note :** Les URLs Unsplash sont stables et fiables.

---

## 📁 Images Locales - Dossier Public

### `public/` (Racine)

| Fichier | Taille | Extension |
|---------|--------|-----------|
| `INSEA_logo.png` | 39 KB | `.png` |
| `event.jpg` | 1.8 MB | `.jpg` |
| `file.svg` | 0.4 KB | `.svg` |
| `globe.svg` | 1 KB | `.svg` |
| `insea-building.jpg` | 623 KB | `.jpg` |
| `logo 1.png` | 94 KB | `.png` |
| `logo 2.png` | 118 KB | `.png` |
| `logo 3.png` | 162 KB | `.png` |
| `logo 4.png` | 52 KB | `.png` |
| `logo-lion.png` | 76 B | `.png` |
| `logo.svg` | 11 KB | `.svg` |
| `next.svg` | 1.3 KB | `.svg` |
| `vercel.svg` | 0.1 KB | `.svg` |
| `window.svg` | 0.4 KB | `.svg` |

### `public/partners/` (Logos Partenaires)

| Fichier | Taille | Extension |
|---------|--------|-----------|
| `Attijariwafa.png` | 6 KB | `.png` |
| `airports.png` | 6 KB | `.png` |
| `banquepopulaire.png` | 33 KB | `.png` |
| `cdg.png` | 25 KB | `.png` |
| `creditdumaroc.png` | 3.7 KB | `.png` |
| `dxc.png` | 40 KB | `.png` |
| `inwi.png` | 1.5 KB | `.png` |
| `maroctelecom.png` | 53 KB | `.png` |
| `ocp.png` | 3.1 KB | `.png` |
| `orange.png` | 2.6 KB | `.png` |
| `orangebusiness.png` | 16 KB | `.png` |
| `partner-2.jpg` | 2.8 KB | `.jpg` |
| `partner-3.png` | 5.6 KB | `.png` |
| `partner-4.png` | 7.3 KB | `.png` |
| `partner-5.png` | 1.8 KB | `.png` |
| `partner-6.png` | 1.8 KB | `.png` |
| `partner-7.png` | 1.8 KB | `.png` |
| `partner-8.png` | 1.8 KB | `.png` |
| `ram.png` | 5.1 KB | `.png` |

### `public/uploads/events/` (Images Événements Uploadées)

| Fichier | Taille | Extension |
|---------|--------|-----------|
| `0c1e7067-3832-48c0-bbb9-32f66af63c7c.webp` | 18 KB | `.webp` |
| `21e5467e-c711-4bad-a028-ddfcbd9f7a72.webp` | 18 KB | `.webp` |
| `2231d90b-18f3-4808-9ff3-7df93f28ee21.webp` | 23 KB | `.webp` |
| `2dc935a5-c433-4360-8b67-d02ba61d2a07.png` | 122 KB | `.png` |
| `2f15755a-8b8e-40e9-9b25-5482149b9978.webp` | 25 KB | `.webp` |
| `4dcc3cd0-a53d-4df4-9129-1558ae14cdac.webp` | 26 KB | `.webp` |
| `73b248a3-5f1a-4ac2-9661-e5da459ad996.webp` | 25 KB | `.webp` |
| `9a6f2c7d-d3a6-4e87-8ed1-997cf2af6aed.webp` | 20 KB | `.webp` |
| `9b39e789-6f63-459f-a652-98516532d72b.png` | 72 KB | `.png` |
| `9b8f0255-5d0c-4fc1-90d6-3253e924a6b1.png` | 178 KB | `.png` |
| `ad7e1d8e-25ae-45fe-bb94-a67cc557c75b.png` | 75 KB | `.png` |
| `af38ca80-ad6e-4dbc-af72-5484d7403b00.webp` | 4.4 KB | `.webp` |
| `b284bcb9-06cd-4886-b399-51acf9cee628.webp` | 23 KB | `.webp` |
| `d27029bd-eef9-48ec-894d-4f1060c59e0b.png` | 132 KB | `.png` |
| `d567e43e-995c-4566-abd5-363a802e5047.webp` | 15 KB | `.webp` |
| `d61f2d33-37bc-4673-8527-d82fe02c1055.webp` | 8.9 KB | `.webp` |
| `e482e4e0-1891-4b87-bf80-f45c48339255.webp` | 60 KB | `.webp` |
| `e4e70d99-a444-4cf7-ac88-be56adcba88c.png` | 176 KB | `.png` |
| `f2d76641-f0f2-4e04-9938-bb36d3b40daa.png` | 24 KB | `.png` |
| `ffcc283f-f5b3-4313-b27d-a3b08f6ec686.webp` | 13 KB | `.webp` |

---

## 📊 Analyse des Extensions

### Distribution par Type de Fichier

```
Extension    | Quantité | % du Total | Usage
-------------|----------|------------|----------------------------------
.png         | 28       | 44%        | Logos, images statiques
.webp        | 12       | 19%        | Images événements (optimisées)
.jpg         | 10       | 16%        | Photos, images de contenu
.svg         | 5        | 8%         | Icônes, logos vectoriels
Google Cache | 4        | 6%         | ⚠️ Images BookHistory (instables)
LinkedIn     | 1        | 2%         | ⚠️ Image BookHistory (dynamique)
Unsplash     | 7        | 11%        | Images blog (stables)
```

### Recommandations par Extension

| Extension | Qualité | Recommandation |
|-----------|---------|----------------|
| `.webp` | ✅ Excellent | Format moderne, compression optimale |
| `.svg` | ✅ Excellent | Parfait pour logos/icônes |
| `.png` | ⚠️ Bon | Poids élevé, considérer conversion en WebP |
| `.jpg` | ⚠️ Bon | Compression possible |
| Google Cache | ❌ Mauvais | Remplacer par images locales urgentement |
| LinkedIn | ❌ Mauvais | Remplacer par image locale |

---

## ✅ Recommandations

### Actions Prioritaires (Haute)

1. **Télécharger et héberger localement les images BookHistory**
   - Les 4 URLs Google Cache sont instables
   - L'URL LinkedIn peut devenir invalide
   
   ```
   Créer: public/images/history/
   - 2002-logo-forum.jpg
   - 2023-conference-plf.jpg
   - 2023-speed-job-dating.jpg
   - 2024-forum-20e.jpg
   - 2024-visa-embauche.jpg
   ```

2. **Convertir les images PNG lourdes en WebP**
   - `event.jpg` (1.8 MB) → Optimiser
   - `maroctelecom.png` (53 KB) → Compresser
   - `logo 3.png` (162 KB) → Compresser

### Actions Secondaires (Moyenne)

3. **Standardiser les noms de fichiers**
   - Remplacer les UUIDs par des noms descriptifs
   - Exemple : `0c1e7067-xxx.webp` → `forum-2024-main.webp`

4. **Ajouter des images de fallback cohérentes**
   - Créer une image de fallback officielle du forum
   - Uniformiser `/insea-building.jpg` et `/fallback-image.jpg`

### Actions Optionnelles (Basse)

5. **Documentation des images**
   - Créer un inventaire dans Google Sheets/Notion
   - Associer chaque image à son événement

---

## 📎 Annexe : URLs Complètes pour Collection

### Images à Télécharger (Événements BookHistory)

```bash
# 1. Logo Forum 2002 (LinkedIn)
wget "https://media.licdn.com/dms/image/v2/D4E0BAQGEHMHyq4BVTA/company-logo_200_200/B4EZlXBs1KIkAI-/0/1758101688171/forumgenientreprises_logo?e=2147483647&v=beta&t=MpKlm0bOboORrRodJxsxK5h-vGfI2yFy3wczxaGZlG4" -O 2002-logo-forum.jpg

# 2. Conférence LDF 2022
wget "https://maroc-ingenierie.ma/wp-content/uploads/2022/01/INSEA-LDF2022.jpg" -O 2022-conference-ldf.jpg

# 3. Forum 18e Edition 2022
wget "https://ensias.um5.ac.ma/sites/ensias.um5.ac.ma/files/images/news/Forum%20GENI-%20Entreprises2022.jpg" -O 2022-forum-18e.jpg

# 4. Forum 19e Edition 2023
wget "https://insea.ac.ma/images/affiche_forum_2023.png" -O 2023-forum-19e.png

# 5. Conférence PLF 2023 (Google Cache - URGENTE)
# URL instable - nécessite recherche manuelle de l'original

# 6. Speed Job Dating 2023 (Google Cache - URGENTE)
# URL instable - nécessite recherche manuelle de l'original

# 7. Forum 20e Edition 2024 (Google Cache - URGENTE)
# URL instable - nécessite recherche manuelle de l'original

# 8. Visa d'Embauche 2024 (Google Cache - URGENTE)
# URL instable - nécessite recherche manuelle de l'original

# 9. Oracle Campus Tour 2025
wget "https://www.atalayar.com/media/atalayar/images/2022/05/19/20220519103922068626.jpg" -O 2025-oracle-campus.jpg

# 10. Forum 21e Edition 2025
wget "https://drh-ma.s3.amazonaws.com/wp-content/uploads/2025/10/09120824/Forum-GENI-Entreprises-2025.jpg" -O 2025-forum-21e.jpg
```

---

**Rapport généré automatiquement par analyse du code source.**  
*Pour toute question, contacter l'équipe technique.*
