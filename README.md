# Blanquette

> Parce qu'un bon espion se doit d'avoir un nom de code à la hauteur de ses exploits.

---

**Blanquette**, c'est une application web pour les amateurs de noms de code et d'intrigues à la OSS 117.  
Avec Blanquette, chaque jour ou chaque semaine, découvrez un nouveau nom de code aléatoire, prêt à être utilisé pour vos missions les plus secrètes.

## Qu'est-ce que Blanquette ?

Blanquette, c'est plus qu'un simple générateur de noms de code. C'est une immersion dans l'univers de l'espionnage à la française, inspiré par les aventures pleines de panache d'OSS 117. Que vous soyez en mission au Caire ou en pleine investigation à Rio, Blanquette est là pour ajouter une touche d'élégance et de mystère à votre quotidien.

Blanquette est aussi là pour vous rappeler que dans l'espionnage, le style est tout aussi important que la mission.

### Fonctionnalités

- **Noms de code quotidiens** : Découvrez un nouveau nom de code chaque jour, parfait pour les agents qui aiment changer d'identité comme de chemise.
- **Noms de code hebdomadaires** : Pour ceux qui préfèrent une intrigue bien ficelée, avec un nom de code qui résonne toute la semaine.

## Développement

```sh
pnpm install
pnpm dev            # serveur de développement
pnpm lint           # Biome
pnpm typecheck      # TypeScript
pnpm test           # tests unitaires (Vitest)
pnpm build && pnpm test:e2e   # tests end-to-end (Playwright, `pnpm exec playwright install chromium` la première fois)
```

## Mises à jour automatiques (Renovate)

Les dépendances sont mises à jour par [Renovate](https://docs.renovatebot.com/) (config : `renovate.json`) :
une version n'est proposée qu'au moins 1 jour après sa publication, et la MR est fusionnée automatiquement si la pipeline passe.

Mise en place sur GitLab :

1. Créer un *Project access token* (rôle Developer ou plus, scopes `api` et `write_repository`) et l'ajouter en variable CI/CD masquée `RENOVATE_TOKEN`.
   Optionnel : `GITHUB_COM_TOKEN` (PAT GitHub en lecture seule) pour récupérer les changelogs.
2. Dans *Build > Pipeline schedules*, créer une planification sur `main`, par ex. `0 3 * * *` (Europe/Paris). Les pipelines planifiées ne lancent que Renovate.
3. Dans *Settings > Merge requests*, activer « Pipelines must succeed » pour qu'aucune MR ne soit fusionnée sans tests verts.
