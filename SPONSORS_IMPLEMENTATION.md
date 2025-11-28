# Implémentation de la Section Sponsors - Bento Grid

## Vue d'ensemble

La section sponsors a été complètement redessinée pour afficher les logos des sponsors dans une grille élégante de type "bento grid". La section s'affiche uniquement si des sponsors sont configurés, et ils sont mis en avant en haut de la page de détail de l'événement.

## Modifications apportées

### 1. Nouveau composant SponsorsGrid (`components/SponsorsGrid.tsx`)

Un composant réutilisable qui affiche les sponsors dans une grille responsive avec :
- Support de 4 tiers de sponsoring (Platinum, Gold, Silver, Bronze)
- Tailles d'affichage variables selon le tier
- Effets hover élégants
- Logos cliquables vers les sites des sponsors
- Affichage du nom au survol

### 2. Composant de prévisualisation admin (`components/admin/SponsorsPreview.tsx`)

Permet aux administrateurs de prévisualiser les sponsors pendant la saisie :
- Validation JSON en temps réel
- Affichage des erreurs de format
- Toggle pour afficher/masquer la prévisualisation
- Compteur de sponsors

### 3. Page de détail d'événement mise à jour

**Fichier**: `app/(sections)/events/[slug]/EventDetailClient.tsx`

Changements :
- Parser JSON des sponsors
- Affichage conditionnel (seulement si `sponsors.length > 0`)
- Section placée en haut, juste après l'image principale
- Design premium avec :
  - Gradient de fond multi-couches
  - Éléments décoratifs flous
  - Icônes Award et Sparkles
  - Badge de remerciement en bas
  - Animations Framer Motion

### 4. Formulaire d'édition amélioré

**Fichier**: `app/admin/events/event/[eventId]/edit/components/EventAdvancedFields.tsx`

- Aide contextuelle avec exemple de format JSON
- Liste des tiers disponibles
- Prévisualisation en temps réel
- Validation du format

## Format des données

### Structure JSON

Les sponsors sont stockés dans le champ `sponsors` de la table `Event` au format JSON :

```json
[
  {
    "name": "Nom du Sponsor",
    "logo": "/uploads/sponsors/logo.png",
    "website": "https://www.sponsor.com",
    "tier": "platinum"
  }
]
```

### Propriétés

| Propriété | Type | Requis | Description |
|-----------|------|--------|-------------|
| `name` | string | Oui | Nom du sponsor |
| `logo` | string | Oui | Chemin vers le logo |
| `website` | string | Non | URL du site web |
| `tier` | string | Non | Niveau de sponsoring |

### Tiers disponibles

- **platinum**: Grille 2 colonnes, logos grands (48px)
- **gold**: Grille 3 colonnes, logos moyens (40px)
- **silver**: Grille 4 colonnes, logos standards (32px)
- **bronze**: Grille 4 colonnes, logos standards (32px)
- **standard** (par défaut): Grille 4 colonnes

## Organisation des fichiers

```
/public/uploads/sponsors/    # Dossier pour les logos
/docs/SPONSORS_FORMAT.md      # Documentation détaillée du format
/scripts/migrate-sponsors.ts  # Script de migration
```

## Utilisation

### Dans l'admin

1. Aller dans l'édition d'un événement
2. Naviguer vers l'onglet "Détails"
3. Trouver le champ "Sponsors (JSON)"
4. Coller le JSON au format requis
5. Vérifier la prévisualisation
6. Sauvegarder

### Exemple complet

```json
[
  {
    "name": "Entreprise Platine",
    "logo": "/uploads/sponsors/platine-logo.png",
    "website": "https://platine.com",
    "tier": "platinum"
  },
  {
    "name": "Sponsor Or 1",
    "logo": "/uploads/sponsors/gold1.png",
    "website": "https://gold1.com",
    "tier": "gold"
  },
  {
    "name": "Sponsor Or 2",
    "logo": "/uploads/sponsors/gold2.png",
    "tier": "gold"
  },
  {
    "name": "Partenaire Standard",
    "logo": "/uploads/sponsors/partner.png"
  }
]
```

## Migration des données existantes

Si vous avez des sponsors au format texte/markdown :

1. Exécuter le script de migration :
```bash
npx tsx scripts/migrate-sponsors.ts
```

2. Le script convertit automatiquement les anciens formats
3. Mettre à jour manuellement les chemins des logos
4. Ajouter les informations complémentaires (website, tier)

Pour voir un exemple sans migration :
```bash
npx tsx scripts/migrate-sponsors.ts --example
```

## Recommandations pour les logos

- **Format**: PNG avec fond transparent
- **Dimensions**: 400x400px minimum
- **Poids**: < 500KB
- **Qualité**: Haute résolution pour affichage Retina
- **Nommage**: `entreprise-nom.png` (minuscules, tirets)

## Comportement

- ✅ La section ne s'affiche que si `sponsors.length > 0`
- ✅ Responsive sur mobile, tablette et desktop
- ✅ Animations fluides au chargement
- ✅ Effets hover élégants
- ✅ Groupement automatique par tier
- ✅ Ordre d'affichage: Platinum → Gold → Silver → Bronze → Standard

## Fichiers créés/modifiés

### Nouveaux fichiers
- `components/SponsorsGrid.tsx`
- `components/admin/SponsorsPreview.tsx`
- `public/uploads/sponsors/` (dossier)
- `public/uploads/README.md`
- `docs/SPONSORS_FORMAT.md`
- `scripts/migrate-sponsors.ts`
- `SPONSORS_IMPLEMENTATION.md` (ce fichier)

### Fichiers modifiés
- `app/(sections)/events/[slug]/EventDetailClient.tsx`
- `app/admin/events/event/[eventId]/edit/components/EventAdvancedFields.tsx`
- `app/admin/events/event/[eventId]/edit/EditEventForm.tsx`

## Support

Pour toute question ou problème :
1. Consulter `docs/SPONSORS_FORMAT.md`
2. Vérifier le format JSON dans l'admin
3. Utiliser la prévisualisation pour détecter les erreurs
