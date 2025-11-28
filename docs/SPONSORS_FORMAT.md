# Format des Sponsors pour les Événements

## Structure JSON

Le champ `sponsors` dans la table `Event` doit contenir un tableau JSON avec la structure suivante :

```json
[
  {
    "name": "Nom du Sponsor",
    "logo": "/images/sponsors/logo-sponsor.png",
    "website": "https://www.sponsor.com",
    "tier": "platinum"
  },
  {
    "name": "Autre Sponsor",
    "logo": "/images/sponsors/logo-autre.png",
    "website": "https://www.autre-sponsor.com",
    "tier": "gold"
  }
]
```

## Propriétés

### `name` (requis)
- Type: `string`
- Le nom du sponsor qui s'affichera au hover

### `logo` (requis)
- Type: `string`
- Chemin vers l'image du logo (peut être une URL absolue ou relative)
- Formats supportés: PNG, JPG, SVG, WebP
- Taille recommandée: 400x400px minimum avec fond transparent

### `website` (optionnel)
- Type: `string`
- URL du site web du sponsor
- Si fourni, le logo sera cliquable

### `tier` (optionnel)
- Type: `'platinum' | 'gold' | 'silver' | 'bronze'`
- Niveau de sponsoring (détermine la taille d'affichage)
- Par défaut: `'standard'`

## Niveaux de Sponsoring

Les sponsors sont affichés par niveau (tier) avec des tailles différentes :

- **Platinum**: Grille 2 colonnes, logos plus grands (h-48)
- **Gold**: Grille 3 colonnes, logos moyens (h-40)
- **Silver/Bronze/Standard**: Grille 4 colonnes, logos standards (h-32)

## Exemple Complet

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
    "website": "https://gold2.com",
    "tier": "gold"
  },
  {
    "name": "Partenaire Standard",
    "logo": "/uploads/sponsors/partner.png",
    "website": "https://partner.com"
  }
]
```

## Comment ajouter des sponsors dans l'admin

1. Allez dans l'édition d'un événement
2. Dans le champ "Sponsors", collez le JSON au format ci-dessus
3. Assurez-vous que les logos sont uploadés dans `/public/uploads/sponsors/`
4. Sauvegardez

## Migration depuis l'ancien format

Si vous avez des sponsors au format texte/markdown, vous devrez les convertir manuellement au format JSON.

Ancien format (Markdown):
```
- Sponsor 1
- Sponsor 2
```

Nouveau format (JSON):
```json
[
  {"name": "Sponsor 1", "logo": "/uploads/sponsors/sponsor1.png"},
  {"name": "Sponsor 2", "logo": "/uploads/sponsors/sponsor2.png"}
]
```
