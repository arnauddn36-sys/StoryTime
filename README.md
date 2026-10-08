# StoryTime 📖

> **Raconte ce que tu as vécu. Quelqu'un se dira : « Moi aussi. »**

StoryTime est une application web pour les personnes qui ont vécu des choses réelles et en parlent peu ou pas.
Elles peuvent **raconter leur histoire de façon anonyme** (sous un pseudo), et les lecteurs peuvent répondre par un bouton **« Moi aussi »** pour dire qu'ils se sentent concernés.

Ce document explique **tout le projet** : l'idée, les outils, la structure, chaque fichier, et où on en est.
Il est écrit pour que toi et moi soyons toujours sur la même ligne.

---

## Sommaire

1. [Le concept](#1-le-concept)
2. [Où on en est (feuille de route)](#2-où-on-en-est-feuille-de-route)
3. [Les outils et pourquoi on les utilise](#3-les-outils-et-pourquoi-on-les-utilise)
4. [Structure du projet](#4-structure-du-projet)
5. [Explication des fichiers, un par un](#5-explication-des-fichiers-un-par-un)
6. [La base de données](#6-la-base-de-données)
7. [La sécurité](#7-la-sécurité)
8. [Variables d'environnement (.env)](#8-variables-denvironnement-env)
9. [Installer et lancer le projet](#9-installer-et-lancer-le-projet)
10. [Docker](#10-docker)
11. [Décisions prises ensemble](#11-décisions-prises-ensemble)
12. [Glossaire](#12-glossaire)

---

## 1. Le concept

**Pour qui ?** Pour celles et ceux qui ont vécu des faits réels (couple, famille, argent, injustice…) et n'osent pas en parler.

**Principe :**
- On écrit son histoire sous un **pseudo choisi** (jamais le vrai nom).
- On la publie dans un **espace** (Football, Couple, Famille…).
- Les lecteurs cliquent sur **« Moi aussi »** quand l'histoire les touche.

**Règle d'or :** StoryTime ne contient que des histoires **vécues et réelles**. Pas de débats, pas de fiction.

### Les 10 espaces (la « sidebar »)

| Emoji | Espace | Contenu |
|---|---|---|
| ⚽ | StoryTime Football | Ce que le football t'a fait vivre (tribune, terrain, supporters) |
| 💔 | StoryTime Couple | Amour, ruptures, trahisons, réconciliations |
| 💸 | StoryTime Argent & Débrouille | Galères, business, dettes, réussites |
| 👨‍👩‍👧 | StoryTime Famille | Parents, frères, sœurs, héritage |
| 🎓 | StoryTime École & Études | Examens, profs, campus |
| 💼 | StoryTime Travail | Patron, collègues, chômage, premier emploi |
| 🏘️ | StoryTime Vie de quartier | Voisins, maquis, transport |
| 🙏 | StoryTime Foi | Doutes, miracles, épreuves |
| 🎶 | StoryTime Musique & Coupé-décalé | Concerts, rêves d'artiste, soirées |
| ⚖️ | StoryTime Injustice | Ce qu'on a subi et dont on parle peu |

Les espaces sont stockés **en base de données** : on pourra en ajouter sans toucher au code.

### Fonctionnalités prévues

- Compte avec **pseudo** + mot de passe (hashé)
- Écriture d'histoires, **brouillon privé** puis publication
- Lecture par **espace** (sidebar déroulante)
- Bouton **« Moi aussi »** animé avec compteur
- **Avertissement de contenu** choisi par l'auteur
- **Partage WhatsApp** en un clic (carte d'aperçu sans révéler l'auteur)
- **Badges de courage** (« Première histoire », « 100 personnes touchées »…)
- **Histoire de la semaine** et classement « Les plus touchantes »
- **Mode clair / sombre**
- **Signalement + modération**
- Messages de soutien anonymes sous chaque histoire
- Plus tard : transcription vocale, mode économie de données, page « Besoin d'aide ? »

---

## 2. Où on en est (feuille de route)

| Étape | Contenu | État |
|---|---|---|
| **1. Fondations** | Structure, Docker, `.env`, base de données, 10 espaces, page d'accueil avec thème clair/sombre | ✅ Livrée (à tester de ton côté) |
| **2. Authentification** | Inscription, connexion, bcrypt, JWT, limitation de requêtes, validation Zod | ⏳ Prochaine |
| **3. Histoires** | Écrire, brouillon, publier, lire par espace, « Moi aussi » | ⬜ |
| **4. Interface** | React Router, sidebar, design final, boutons animés | ⬜ |
| **5. Fonctions spéciales** | Partage WhatsApp, badges, histoire de la semaine, signalement, tests, déploiement | ⬜ |

On avance **une étape à la fois**, et on valide ensemble avant de passer à la suivante.

---

## 3. Les outils et pourquoi on les utilise

### Langage et exécution

| Outil | Rôle | Pourquoi ce choix |
|---|---|---|
| **TypeScript** | JavaScript avec des types (`string`, `number`…) | Détecte les erreurs avant même de lancer le programme |
| **Bun** | Remplace Node.js, npm et plus encore | Très rapide ; il lance le TypeScript directement ; il a **bcrypt intégré** |

### Backend (le serveur, dans `backend/`)

| Paquet | Rôle | Pourquoi |
|---|---|---|
| **hono** | Framework web : reçoit les requêtes et renvoie les réponses | Léger, rapide, typé, fait pour Bun. Il contient aussi `cors`, `logger`, `secure-headers` et les `jwt` |
| **zod** | Vérifie la forme des données (formulaires, `.env`) | Ne jamais faire confiance à ce que le client envoie |
| **@hono/zod-validator** | Branche Zod sur les routes Hono | Valider chaque requête en une ligne (utilisé à partir de l'étape 2) |
| **drizzle-orm** | ORM : écrire en TypeScript au lieu de SQL brut | Requêtes typées, moins d'erreurs |
| **drizzle-kit** *(dev)* | Génère et applique les migrations (création des tables) | Garde la base synchronisée avec `schema.ts` |
| **postgres** | Pilote qui parle à PostgreSQL | Choisi par Drizzle, compatible Supabase |
| **typescript**, **@types/bun** *(dev)* | Vérification des types | Confort et sécurité |

### Frontend (le site, dans `frontend/`)

| Paquet | Rôle | Pourquoi |
|---|---|---|
| **react** + **react-dom** | Construire l'interface avec des composants | Standard du marché |
| **vite** | Serveur de développement et outil de build | Démarrage instantané |
| **@vitejs/plugin-react** | Fait comprendre React à Vite | Nécessaire |
| **tailwindcss** + **@tailwindcss/vite** | Styles avec des classes (`bg-amber-500`, `rounded-full`…) | Design rapide, mobile d'abord, mode sombre facile |

### Base de données et infrastructure

| Outil | Rôle |
|---|---|
| **PostgreSQL** | Base de données relationnelle |
| **Supabase** | Héberge PostgreSQL gratuitement. **On l'utilise uniquement comme base de données** : l'authentification est faite par notre propre code (JWT + bcrypt) |
| **Docker** | Lance le projet dans des conteneurs identiques partout |

### Outils ajoutés plus tard (pour la performance et la qualité)

- **React Router** : navigation entre les pages
- **TanStack Query** : gère les appels à l'API (cache, rechargement)
- **Vitest** : tests automatiques
- **ESLint + Prettier** : code propre et homogène
- **Limitation de requêtes (rate limiting)** : bloque les abus et les attaques par force brute

---

## 4. Structure du projet

```
storytime/
├── .gitignore                 ← fichiers à NE PAS envoyer sur GitHub
├── .env.example               ← modèle des variables secrètes (sans valeurs réelles)
├── docker-compose.yml         ← lance backend + frontend ensemble
├── README.md                  ← ce document
│
├── backend/                   ← le serveur (API)
│   ├── .env.example           ← modèle du .env pour le backend
│   ├── package.json           ← liste des paquets et des commandes
│   ├── tsconfig.json          ← réglages TypeScript
│   ├── Dockerfile             ← recette de l'image Docker du backend
│   ├── drizzle.config.ts      ← réglages des migrations Drizzle
│   └── src/
│       ├── index.ts           ← point d'entrée : crée et démarre le serveur
│       ├── config/
│       │   └── env.ts         ← lit et valide les variables du .env
│       └── db/
│           ├── schema.ts      ← description de toutes les tables
│           ├── client.ts      ← connexion à Supabase
│           └── seed.ts        ← insère les 10 espaces
│
└── frontend/                  ← le site (ce que voit l'utilisateur)
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts         ← réglages Vite + proxy vers le backend
    ├── Dockerfile
    ├── index.html             ← page HTML de base
    └── src/
        ├── main.tsx           ← démarre React
        ├── App.tsx            ← composant principal (page d'accueil)
        └── index.css          ← charge Tailwind + mode sombre
```

**Dossiers générés (jamais envoyés sur GitHub) :** `node_modules/` (paquets installés), `backend/drizzle/` (migrations générées, à envoyer au contraire sur GitHub si on veut les partager), `dist/` (version compilée).

---

## 5. Explication des fichiers, un par un

### Racine

**`.gitignore`** : liste ce que Git doit ignorer. Le plus important : `.env`, qui contient tes secrets. Si ce fichier partait sur GitHub, n'importe qui pourrait lire ta base de données.

**`.env.example`** : modèle du `.env`. Il, lui, peut aller sur GitHub car il ne contient que des valeurs d'exemple.

**`docker-compose.yml`** : décrit deux services (`backend` sur le port 3000, `frontend` sur le port 5173) et les lance ensemble avec `docker compose up --build`. Il n'y a pas de conteneur PostgreSQL, car la base est chez Supabase.

### Backend

**`backend/src/config/env.ts`**
- Lit `process.env` (les variables du `.env`).
- Utilise **Zod** pour vérifier que chacune existe et a la bonne forme (`JWT_SECRET` d'au moins 32 caractères, `FRONTEND_URL` doit être une vraie URL…).
- Si quelque chose manque, le serveur **refuse de démarrer** avec un message clair. C'est voulu : mieux vaut un arrêt net qu'un bug mystérieux plus tard.
- Exporte `env`, un objet typé utilisé partout ailleurs.

**`backend/src/db/schema.ts`** : décrit les tables en TypeScript (voir section 6). Drizzle en déduit le SQL.

**`backend/src/db/client.ts`**
- Ouvre la connexion à Supabase avec `postgres(env.DATABASE_URL, { ssl: "require" })` : communication chiffrée, 10 connexions maximum.
- Exporte `db`, l'objet qu'on utilisera pour lire et écrire dans la base (`db.select()`, `db.insert()`…).

**`backend/src/db/seed.ts`** : insère les 10 espaces. `onConflictDoNothing()` évite les doublons si on relance la commande.

**`backend/src/index.ts`** : le cœur du serveur.
1. Crée l'application Hono.
2. `logger()` : affiche chaque requête dans la console.
3. `secureHeaders()` : ajoute des en-têtes de sécurité HTTP (équivalent de Helmet).
4. `cors()` : seul notre frontend (`FRONTEND_URL`) peut appeler l'API.
5. Route `GET /api/health` : fait un `select 1` en base et répond `{ ok: true }` si tout fonctionne.
6. `notFound` et `onError` : réponses JSON propres, sans jamais révéler de détails internes à l'utilisateur.
7. `export default { port, fetch }` : c'est ce que Bun lit pour démarrer le serveur.

**`backend/drizzle.config.ts`** : dit à `drizzle-kit` où est le schéma, où écrire les migrations (`./drizzle`) et quelle base utiliser.

**`backend/Dockerfile`** : image `oven/bun:1`, copie d'abord `package.json` (pour profiter du cache Docker), installe les paquets, copie le code, lance `bun src/index.ts`.

**`backend/package.json`**, commandes disponibles :

| Commande | Effet |
|---|---|
| `bun run dev` | Lance le serveur et le relance à chaque modification |
| `bun run start` | Lance le serveur (production) |
| `bun run typecheck` | Vérifie les types sans rien lancer |
| `bun run db:generate` | Crée les fichiers de migration SQL depuis `schema.ts` |
| `bun run db:migrate` | Applique les migrations dans Supabase |
| `bun run db:seed` | Insère les 10 espaces |

### Frontend

**`frontend/vite.config.ts`** : active React et Tailwind, et configure un **proxy** : toute requête vers `/api` est envoyée à `http://localhost:3000`. Le frontend appelle donc `/api/...` sans se soucier de l'adresse du backend.

**`frontend/index.html`** : la seule vraie page HTML. Elle contient `<div id="root">` où React dessine tout.

**`frontend/src/main.tsx`** : monte le composant `App` dans `#root`.

**`frontend/src/index.css`** : charge Tailwind et déclare que le mode sombre s'active quand `<html>` porte la classe `dark`.

**`frontend/src/App.tsx`** : page d'accueil de départ.
- `useState` mémorise le thème (clair/sombre) et l'état du serveur.
- Le thème choisi est sauvegardé dans le navigateur (`localStorage`) ; au premier lancement, on suit la préférence du téléphone.
- `useEffect` ajoute ou retire la classe `dark` sur `<html>`, et appelle `/api/health` au démarrage pour afficher « ✅ connecté » ou « ❌ hors ligne ».

---

## 6. La base de données

Quatre tables (définies dans `backend/src/db/schema.ts`) :

```
utilisateurs                 espaces
├ id (uuid)                  ├ id (uuid)
├ pseudo (unique)            ├ slug (unique)  ex: "football"
├ mot_de_passe_hash          ├ nom            ex: "StoryTime Football"
├ role (membre|moderateur)   ├ emoji, couleur, description
└ cree_le                    └ ordre (position dans la sidebar)
        │                            │
        └──────────┐      ┌──────────┘
                   ▼      ▼
                  histoires
                  ├ id (uuid)
                  ├ auteur_id  → utilisateurs.id
                  ├ espace_id  → espaces.id
                  ├ titre, contenu
                  ├ avertissement (optionnel)
                  ├ statut (brouillon|publiee)
                  └ cree_le, publiee_le
                        │
                        ▼
                    moi_aussi
                    ├ histoire_id     → histoires.id
                    ├ utilisateur_id  → utilisateurs.id
                    └ clé composée : un seul « Moi aussi » par personne et par histoire
```

Points à retenir :
- Les identifiants sont des **UUID** : impossibles à deviner (contrairement à 1, 2, 3…).
- `onDelete: "cascade"` : si un compte est supprimé, ses histoires et ses « Moi aussi » le sont aussi.
- Une histoire est **brouillon** (visible par son auteur seulement) tant qu'elle n'est pas **publiée**.

---

## 7. La sécurité

| Protection | Où | Comment |
|---|---|---|
| Mots de passe hashés | Étape 2 | **bcrypt** (intégré à Bun) : on ne stocke jamais le mot de passe, seulement son empreinte |
| Connexion par JWT | Étape 2 | Jeton signé avec `JWT_SECRET`, durée limitée |
| En-têtes HTTP sécurisés | `index.ts` | `secureHeaders()` de Hono (équivalent de Helmet) |
| CORS strict | `index.ts` | Seul `FRONTEND_URL` est autorisé |
| Validation des données | `env.ts` puis chaque route | **Zod** : rien n'entre sans être vérifié |
| Secrets hors du code | `.env` + `.gitignore` | Jamais envoyés sur GitHub |
| Erreurs discrètes | `index.ts` | Le client reçoit « Erreur interne », le détail reste dans nos logs |
| Connexion base chiffrée | `client.ts` | SSL obligatoire |
| Anti-abus | Étape 2 | Limitation du nombre de tentatives de connexion |
| Anonymat | Tout le projet | Pseudo choisi, aucun nom réel, aucun e-mail obligatoire |

---

## 8. Variables d'environnement (.env)

| Variable | Rôle | Exemple |
|---|---|---|
| `PORT` | Port du backend | `3000` |
| `NODE_ENV` | Mode (`development` ou `production`) | `development` |
| `FRONTEND_URL` | Adresse du frontend (pour CORS) | `http://localhost:5173` |
| `DATABASE_URL` | Lien de connexion Supabase (**secret**) | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | Clé qui signe les JWT (**secret**, 32 caractères minimum) | généré avec `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | Durée de connexion en secondes | `604800` (7 jours) |

---

## 9. Installer et lancer le projet

**Prérequis :** [Bun](https://bun.sh) installé, un compte [Supabase](https://supabase.com) gratuit, et (optionnel) Docker.

1. **Crée un projet Supabase** et copie le lien : *Project Settings → Database → Connection string → URI*.
2. **Crée le `.env`** : copie `.env.example` en `.env`, remplis `DATABASE_URL` et `JWT_SECRET`, puis copie-le aussi dans `backend/` :
   ```bash
   cp .env.example .env
   # (édite .env avec tes vraies valeurs)
   cp .env backend/.env
   ```
3. **Backend** :
   ```bash
   cd backend
   bun install
   bun run db:generate   # crée les migrations
   bun run db:migrate    # crée les tables dans Supabase
   bun run db:seed       # insère les 10 espaces
   bun run dev           # API sur http://localhost:3000
   ```
4. **Frontend** (autre terminal) :
   ```bash
   cd frontend
   bun install
   bun run dev           # site sur http://localhost:5173
   ```
5. Ouvre http://localhost:5173 : tu dois voir **« Serveur : ✅ connecté »**.

**Si ça ne marche pas :**
- `❌ Variables d'environnement invalides` → le `.env` est absent de `backend/` ou incomplet.
- `Serveur : ❌ hors ligne` → le backend n'est pas lancé, ou `DATABASE_URL` est faux.
- Erreur de connexion à Supabase → vérifie le mot de passe dans l'URL.

---

## 10. Docker

```bash
docker compose up --build
```

Lance le backend (port 3000) et le frontend (port 5173). Les secrets sont lus depuis le `.env` de la racine (`env_file`). Ne mets **jamais** de secrets dans le Dockerfile ni dans `docker-compose.yml`.

---

## 11. Décisions prises ensemble

| Décision | Choix |
|---|---|
| Type d'appli | Écrire et publier ses propres histoires vécues |
| Backend | **Hono** sur **Bun** |
| Anonymat | **Pseudo choisi** par l'auteur |
| Thème | **Clair + sombre** avec bouton de bascule |
| Organisation | Sidebar d'**espaces** (10 espaces fixes au départ, pas créés par les utilisateurs) |
| Helmet | Remplacé par `secureHeaders` de Hono (Helmet est réservé à Express) |
| bcrypt / JWT | Fonctions intégrées à Bun et Hono, aucun paquet supplémentaire |
| Authentification | Nôtre (JWT + bcrypt). Supabase sert **uniquement** de base PostgreSQL |
| Fonctions reportées à l'étape 5 | Transcription vocale, mode économie de données |

---

## 12. Glossaire

- **API** : le serveur, qui répond aux demandes du site (« donne-moi les histoires »).
- **Backend / Frontend** : la partie serveur, cachée / la partie visible dans le navigateur.
- **ORM** : outil qui permet d'écrire dans la base avec du code plutôt que du SQL.
- **Migration** : fichier qui décrit un changement de la base (créer une table, ajouter une colonne).
- **Seed** : remplir la base avec des données de départ.
- **Hash** : empreinte irréversible d'un mot de passe. On ne peut pas retrouver le mot de passe à partir d'elle.
- **JWT** : jeton signé qui prouve qu'on est connecté.
- **CORS** : règle du navigateur qui limite quels sites peuvent appeler une API.
- **Middleware** : fonction qui s'exécute avant chaque route (journal, sécurité, CORS…).
- **UUID** : identifiant long et aléatoire, impossible à deviner.
- **Proxy** : relais ; ici, Vite transmet les appels `/api` au backend.
