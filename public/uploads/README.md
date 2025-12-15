# Dossier Uploads

Ce dossier contient toutes les images uploadées par les utilisateurs dans l'interface d'administration.

## Structure

```
uploads/
├── events/       # Images des événements
├── blog/         # Images des articles de blog
└── jobs/         # Images des offres d'emploi
```

## Configuration Git

Les fichiers uploadés dans ce dossier sont **automatiquement ignorés par Git** pour éviter de polluer le dépôt avec des fichiers binaires volumineux.

Seuls les fichiers `.gitkeep` sont suivis pour préserver la structure des dossiers.

## En production

Sur votre serveur de production, assurez-vous que :

1. Le dossier `public/uploads` existe et est accessible en écriture
2. Les permissions sont correctement configurées (755 pour les dossiers, 644 pour les fichiers)
3. Un système de backup régulier est en place pour les images uploadées

## Nettoyage

Pour supprimer les images orphelines (non référencées en base de données), consultez la documentation dans `/docs/IMAGE_MANAGEMENT.md` - section "Maintenance".
