# GTA5 Clothing Indexer — Plan Complet du Projet

## 1. Objectif du projet

Créer une application desktop Windows qui scanne un dossier contenant des fichiers de vêtements GTA5 (formats .ydd et .ytd), les indexe automatiquement, et permet de les visualiser, filtrer et sélectionner via une interface moderne.

---

## 2. Contexte technique

### Les fichiers concernés

- **Fichiers .ydd** : modèles 3D (meshes) au format propriétaire Rockstar (RAGE engine)
- **Fichiers .ytd** : textures associées aux modèles (contiennent des images au format DDS)
- **Convention de nommage FiveM** : `mp_f_freemode_01^accs_010_u.ydd`
  - `mp_f` ou `mp_m` → genre (féminin / masculin)
  - `freemode_01` → modèle de personnage
  - `accs` → catégorie du vêtement (accessoire)
  - `010` → numéro du composant
  - `u` ou `r` → variante (unique / replace)
  - `.ydd` ou `.ytd` → type de fichier (modèle ou texture)

### Les catégories de vêtements GTA5

| Code  | Description        |
|-------|--------------------|
| accs  | Accessoires        |
| jbib  | Hauts / Vestes     |
| lowr  | Pantalons / Bas    |
| feet  | Chaussures         |
| teef  | Dents              |
| head  | Têtes              |
| berd  | Barbes             |
| hair  | Cheveux            |
| uppr  | Torso / Sous-vêtements |
| hand  | Mains / Gants      |
| task  | Gilets tactiques   |
| decl  | Décals / Overlays  |
| p_head | Props tête (chapeaux) |
| p_eyes | Props yeux (lunettes) |
| p_ears | Props oreilles     |
| p_lhand | Props main gauche |
| p_rhand | Props main droite |

### Convention de nommage des textures YTD

Pour un fichier `.ydd` donné, il peut exister **plusieurs fichiers `.ytd`** correspondant à autant de variantes de couleur/texture. La lettre dans le nom du `.ytd` indique la variante :

- **Modèle :** `mp_f_freemode_01^jbib_001_u.ydd`
- **Texture A :** `mp_f_freemode_01^jbib_diff_001_a_uni.ytd`
- **Texture B :** `mp_f_freemode_01^jbib_diff_001_b_uni.ytd`
- **Texture C :** `mp_f_freemode_01^jbib_diff_001_c_uni.ytd`
- ...

La relation YDD → YTD est donc **1:N** (un modèle, plusieurs textures).

### Volume estimé

- Environ 500 à 1000 fichiers `.ydd` et `.ytd` combinés
- Un même `.ydd` peut avoir de 1 à 20+ fichiers `.ytd` associés
- Tous situés dans un seul et même dossier

---

## 3. Stack technique choisie

### Plateforme : Electron (app desktop avec technologies web)

- **Pourquoi Electron** : permet de créer une app Windows native avec HTML/CSS/JS, accès complet au système de fichiers, et rendu 3D via Three.js
- **Framework UI** : Svelte (léger, performant, syntaxe simple et réactive)
- **Langage** : JavaScript ou TypeScript
- **Rendu 3D (Phase 3)** : Three.js (via threlte, un wrapper Svelte pour Three.js)

### Dépendances principales prévues

| Besoin | Outil | Rôle |
|--------|-------|------|
| App desktop | Electron | Fenêtre native Windows + accès fichiers |
| Interface | Svelte + Tailwind CSS | UI légère et réactive |
| Scan de fichiers | Node.js `fs` (natif) | Lire le contenu du dossier |
| Parsing des noms | Regex JavaScript | Extraire genre, catégorie, numéro, variante |
| Rendu 3D (Phase 3) | Three.js via Threlte | Afficher les modèles .ydd |
| Parsing YDD (Phase 3) | Parser custom ou portage CodeWalker | Convertir .ydd en mesh exploitable |
| Parsing YTD (Phase 2) | Parser custom | Extraire les textures DDS des .ytd |
| Conversion DDS (Phase 2) | Bibliothèque DDS → PNG | Afficher les textures en preview |

---

## 4. Architecture de l'application

```
┌─────────────────────────────────────────────────┐
│                   ELECTRON                       │
│                                                  │
│  ┌─────────────┐    ┌────────────────────────┐  │
│  │  Processus   │    │   Processus Renderer   │  │
│  │  Principal   │    │                        │  │
│  │  (Main)      │◄──►│  React App             │  │
│  │              │    │  ├─ Barre de recherche  │  │
│  │  - Scan des  │    │  ├─ Filtres             │  │
│  │    fichiers  │    │  ├─ Grille de résultats │  │
│  │  - Lecture   │    │  ├─ Panneau de détails  │  │
│  │    fichiers  │    │  └─ Viewer 3D (Phase 3) │  │
│  │  - Parsing   │    │                        │  │
│  └─────────────┘    └────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- **Processus Principal (Main)** : gère tout ce qui touche au système de fichiers — scanner le dossier, lire les fichiers binaires, parser les données
- **Processus Renderer** : gère l'affichage — l'interface React avec les filtres, la grille, les previews

---

## 5. Phases de développement

### Phase 1 — Scanner & Indexation (MVP)

**Objectif** : pouvoir ouvrir un dossier et voir tous ses vêtements organisés.

**Fonctionnalités** :
- Bouton "Choisir un dossier" qui ouvre un sélecteur de dossier natif Windows
- Scan récursif du dossier sélectionné pour trouver tous les .ydd et .ytd
- Parsing du nom de chaque fichier pour extraire les métadonnées (genre, catégorie, numéro, variante)
- Appairage automatique des fichiers .ydd avec tous leurs .ytd associés (relation 1:N)
- Affichage sous forme de grille/liste avec toutes les entrées indexées
- Filtres par : genre (homme/femme), catégorie (jbib, lowr, etc.)
- Barre de recherche par nom de fichier
- Compteur du nombre total de vêtements

**Résultat attendu** : une interface qui liste tous les vêtements, filtrable et cherchable, mais sans preview visuel.

---

### Phase 2 — Preview des textures (2D)

**Objectif** : afficher une miniature de chaque vêtement basée sur sa texture.

**Fonctionnalités** :
- Lecture des fichiers .ytd (format binaire RAGE)
- Extraction des textures embarquées (format DDS)
- Conversion DDS → PNG/JPEG en mémoire pour affichage
- Affichage de la miniature de texture dans chaque carte de la grille
- Cache des miniatures pour ne pas re-parser à chaque fois

**Complexité** : c'est la phase la plus technique car il faut écrire ou porter un parser pour le format .ytd. Le format est documenté par la communauté (CodeWalker, gta5-mods.com).

---

### Phase 3 — Viewer 3D

**Objectif** : cliquer sur un vêtement et voir son modèle 3D avec la texture appliquée.

**Fonctionnalités** :
- Lecture des fichiers .ydd (format binaire RAGE)
- Extraction du mesh (vertices, faces, UV maps, normales)
- Conversion en géométrie Three.js (BufferGeometry)
- Application de la texture extraite en Phase 2
- Panneau 3D interactif : rotation, zoom, déplacement de caméra
- Éclairage basique pour bien voir le modèle

**Complexité** : la plus ambitieuse des trois phases. Le parsing .ydd est complexe mais le code source de CodeWalker (C#, open-source) sert de référence complète pour le portage en JavaScript.

---

## 6. Structure du modèle de données

Chaque vêtement indexé sera représenté par un objet contenant :

```
ClothingItem {
  id            : identifiant unique (basé sur le nom de fichier)
  fileName      : nom du fichier sans extension (ex: "mp_f_freemode_01^accs_010_u")
  gender        : "male" | "female"
  model         : "freemode_01" (le modèle de personnage)
  category      : "accs" | "jbib" | "lowr" | ... (le type de vêtement)
  categoryLabel : "Accessoires" | "Hauts / Vestes" | ... (nom lisible)
  componentNum  : 10 (le numéro du composant)
  variant       : "u" | "r" (unique ou replace)
  yddPath       : chemin complet vers le fichier .ydd
  ytdPaths      : [] (tableau de chemins vers les .ytd — relation 1:N, peut être vide)
  ytdCount      : 3 (nombre de variantes de texture disponibles)
  hasYdd        : true/false (indique si le fichier .ydd est présent)
  hasTextures   : true/false (indique si au moins un .ytd est associé)
  thumbnailData : null (rempli en Phase 2 — données de l'image preview de la première texture)
}
```

---

## 7. Interface utilisateur (maquette conceptuelle)

```
┌──────────────────────────────────────────────────────────┐
│  🔍 Recherche...                    [📁 Choisir dossier] │
│                                                          │
│  Filtres: [Tous ▼] [Homme/Femme ▼] [Catégorie ▼]       │
│           623 vêtements trouvés                          │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🖼 thumb  │ │ 🖼 thumb  │ │ 🖼 thumb  │ │ 🖼 thumb  │   │
│  │          │ │          │ │          │ │          │   │
│  │ ACCS 010 │ │ ACCS 015 │ │ JBIB 005 │ │ JBIB 012 │   │
│  │ Femme    │ │ Femme    │ │ Femme    │ │ Femme    │   │
│  │ ✅ YDD+YTD│ │ ✅ YDD+YTD│ │ ⚠ YDD only│ │ ✅ YDD+YTD│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 🖼 thumb  │ │ 🖼 thumb  │ │ 🖼 thumb  │ │ 🖼 thumb  │   │
│  │          │ │          │ │          │ │          │   │
│  │ LOWR 003 │ │ LOWR 018 │ │ FEET 001 │ │ FEET 009 │   │
│  │ Femme    │ │ Femme    │ │ Femme    │ │ Femme    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Points de vigilance

- **Performance** : avec ~1000 fichiers, l'indexation sera rapide. Mais les previews de textures (Phase 2) devront être mises en cache pour éviter de re-parser à chaque lancement.
- **Parsing YTD/YDD** : c'est le cœur technique du projet. Le format est documenté mais pas trivial. On s'appuiera sur la documentation communautaire et le code source de CodeWalker.
- **Fichiers orphelins** : certains vêtements pourraient avoir un .ydd sans aucun .ytd (ou des .ytd sans .ydd). L'app doit gérer ces cas proprement. Un .ydd avec plusieurs .ytd est la norme, pas l'exception.
- **Noms non-standard** : même si la convention FiveM est suivie, prévoir un fallback pour les fichiers dont le nom ne matche pas le pattern attendu.
