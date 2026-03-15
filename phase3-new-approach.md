# Phase 3 (v2) — Viewer 3D via conversion automatique

## 1. Principe général

Au lieu de parser nous-mêmes les fichiers binaires RAGE (.ydd/.ytd), on délègue la conversion à un outil CLI existant qui transforme les fichiers en .glb (format standard 3D). Three.js sait charger les .glb nativement, ce qui rend le viewer trivial à implémenter.

```
Fichier .ydd + .ytd
        │
        ▼
┌──────────────────┐
│  CLI de conversion│  ← Outil tiers embarqué dans l'app
│  (CW Model Conv.) │
│  .ydd/.ytd → .glb │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Fichier .glb     │  ← Stocké dans un dossier cache
│  (modèle 3D +     │
│   textures incluses)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Three.js         │
│  GLTFLoader       │  ← Charge le .glb en une ligne de code
│  → Mesh + Texture │
└──────────────────┘
```

---

## 2. L'outil de conversion : CW Model Convert

### Qu'est-ce que c'est ?

- Un outil en ligne de commande basé sur les bibliothèques de CodeWalker
- Capable de convertir les fichiers .ydd (+ .ytd associé) en formats standards (.glb, .gltf, .obj)
- Open-source, gratuit, communauté active
- C'est un exécutable Windows (.exe) autonome

### Où le trouver

- GitHub : chercher "CodeWalker" ou "CW Model Convert" sur GitHub
- Releases de CodeWalker : souvent inclus ou dérivable du projet principal
- Alternativement : utiliser la version CLI de **GTAUtil** qui fait la même chose

### Comment il s'utilise

```bash
# Conversion basique d'un .ydd en .glb
CWModelConvert.exe -i "mp_f_freemode_01^jbib_005_u.ydd" -o "jbib_005_u.glb"

# Si la texture .ytd est dans le même dossier, il la détecte automatiquement
# Sinon on peut la spécifier
CWModelConvert.exe -i "fichier.ydd" -t "fichier.ytd" -o "sortie.glb"
```

### Format de sortie : .glb

Le format .glb (GLB = GL Binary) c'est :
- Un seul fichier qui contient tout : le mesh 3D, les textures, les matériaux
- Format standard du web 3D (glTF 2.0)
- Supporté nativement par Three.js via `GLTFLoader`
- Compact et rapide à charger

---

## 3. Architecture dans l'app

### 3.1 — Où stocker le CLI

```
resources/
└── tools/
    └── CWModelConvert.exe    ← Embarqué dans l'app
```

Electron permet d'accéder au dossier `resources/` via `process.resourcesPath`. L'exe est distribué avec l'app, l'utilisateur n'a rien à installer manuellement.

### 3.2 — Le dossier cache

```
%APPDATA%/gta5-clothing-indexer/
└── cache/
    └── glb/
        ├── mp_f_freemode_01^jbib_005_u.glb
        ├── mp_f_freemode_01^lowr_003_u.glb
        └── ...
```

- Chaque .glb est nommé d'après le fichier source (sans l'extension .ydd)
- Avant de convertir, on vérifie si le .glb existe déjà dans le cache → pas de reconversion inutile
- L'utilisateur peut vider le cache depuis les paramètres de l'app si besoin

### 3.3 — Fichiers à créer / modifier

```
src/
├── main/
│   ├── converter.ts          ← NEW : gère l'appel au CLI de conversion
│   ├── cache.ts              ← NEW : gère le dossier cache (chemins, vérification, nettoyage)
│   └── index.ts              ← MODIFIER : ajouter les handlers IPC pour la conversion
│
├── preload/
│   └── index.ts              ← MODIFIER : exposer les fonctions de conversion au frontend
│
└── renderer/src/
    └── lib/
        ├── components/
        │   ├── Viewer3D.svelte        ← NEW : le viewer 3D (canvas Threlte)
        │   ├── ClothingModel.svelte   ← NEW : charge et affiche un .glb
        │   └── ViewerControls.svelte  ← NEW : boutons du viewer (reset caméra, etc.)
        └── stores/
            └── viewer.ts              ← NEW : store pour l'état du viewer (modèle actif, chargement)
```

---

## 4. Implémentation détaillée

### 4.1 — Le convertisseur (src/main/converter.ts)

**Rôle** : appeler le CLI de conversion et retourner le chemin du .glb généré.

**Logique** :

```
Fonction convertToGlb(yddPath, ytdPath?) → glbPath

1. Calculer le nom du fichier .glb attendu (basé sur le nom du .ydd)
2. Vérifier si le .glb existe déjà dans le cache
   → Si oui : retourner le chemin directement (pas de reconversion)
   → Si non : continuer
3. Construire la commande CLI :
   - Chemin vers l'exe : path.join(process.resourcesPath, 'tools', 'CWModelConvert.exe')
   - Arguments : -i [yddPath] -t [ytdPath] -o [glbCachePath]
4. Exécuter la commande via child_process.execFile()
5. Attendre la fin de l'exécution
6. Vérifier que le .glb a bien été créé
   → Si oui : retourner le chemin
   → Si erreur : retourner l'erreur au frontend
```

**Points importants** :
- Utiliser `execFile` (pas `exec`) pour éviter les injections de commande
- Gérer le timeout (certains fichiers peuvent être longs à convertir)
- Capturer stderr pour les messages d'erreur du CLI

### 4.2 — Le cache (src/main/cache.ts)

**Rôle** : gérer le dossier cache des .glb.

**Fonctions** :

```
getCachePath()         → Retourne le chemin du dossier cache (le créer si inexistant)
getGlbPath(fileName)   → Retourne le chemin attendu du .glb pour un fichier donné
isConverted(fileName)  → Vérifie si le .glb existe déjà dans le cache
clearCache()           → Supprime tous les .glb du cache
getCacheSize()         → Retourne la taille totale du cache en Mo
```

### 4.3 — Les handlers IPC (src/main/index.ts)

Ajouter deux handlers :

```
'convert-clothing' → Reçoit { yddPath, ytdPath }
                     Appelle convertToGlb()
                     Retourne { glbPath } ou { error }

'get-glb-path'     → Reçoit { fileName }
                     Vérifie si le .glb est en cache
                     Retourne { glbPath, isCached: true } ou { isCached: false }
```

### 4.4 — Le Preload (src/preload/index.ts)

Exposer au frontend :

```
convertClothing(yddPath, ytdPath) → Promise<{ glbPath: string }>
getGlbPath(fileName)              → Promise<{ glbPath: string, isCached: boolean }>
```

### 4.5 — Le Viewer 3D (src/renderer/src/lib/components/Viewer3D.svelte)

**Structure Threlte** :

```
<Canvas>
  ├── <T.PerspectiveCamera>
  │     position: calculée selon la bounding box du modèle
  │     fov: 50
  │
  ├── <OrbitControls>
  │     enableDamping: true (rotation fluide)
  │     minDistance: 0.5
  │     maxDistance: 10
  │
  ├── <T.AmbientLight>
  │     intensity: 0.6
  │     color: blanc
  │
  ├── <T.DirectionalLight>
  │     intensity: 0.8
  │     position: [5, 5, 5]
  │
  ├── <T.DirectionalLight>          ← 2e lumière pour combler les ombres
  │     intensity: 0.3
  │     position: [-3, 2, -3]
  │
  └── <ClothingModel glbPath={...} />
</Canvas>
```

**Fond du viewer** : gris neutre foncé (#1a1a2e ou similaire), configurable.

### 4.6 — Le composant ClothingModel (ClothingModel.svelte)

**Rôle** : charger un .glb et l'afficher dans la scène.

**Logique** :

```
1. Recevoir glbPath en prop
2. Charger le .glb via GLTFLoader de Three.js
   - Le GLTFLoader retourne une scène complète (mesh + textures + matériaux)
   - Pas besoin de reconstruire quoi que ce soit manuellement
3. Centrer le modèle :
   - Calculer la bounding box du modèle chargé
   - Translater le modèle pour que son centre soit à l'origine (0, 0, 0)
4. Redimensionner si nécessaire :
   - Normaliser la taille pour que le modèle rentre bien dans le viewport
5. Ajouter le modèle à la scène Threlte
6. Quand un nouveau glbPath arrive → disposer l'ancien modèle, charger le nouveau
```

**Utilisation du GLTFLoader** :

```
- Importer : import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
- Charger : loader.load(glbPath, (gltf) => { scene.add(gltf.scene) })
- Le .glb contient TOUT : géométries, textures, matériaux → rien à assembler
```

---

## 5. Flux utilisateur complet

```
L'utilisateur clique sur un vêtement dans la grille
        │
        ▼
Le frontend envoie une requête IPC "convert-clothing"
avec les chemins .ydd et .ytd
        │
        ▼
Le main vérifie le cache
        │
   ┌────┴────┐
   │         │
Le .glb    Le .glb
existe     n'existe pas
   │         │
   │         ▼
   │    Lancer le CLI de conversion
   │    Afficher un loader dans le viewer
   │    (ex: "Conversion en cours...")
   │         │
   │         ▼
   │    .glb généré et sauvé dans le cache
   │         │
   └────┬────┘
        │
        ▼
Le chemin du .glb est renvoyé au frontend
        │
        ▼
Le composant Viewer3D charge le .glb
via GLTFLoader de Three.js
        │
        ▼
Le modèle 3D s'affiche avec ses textures
L'utilisateur peut tourner, zoomer, déplacer
```

---

## 6. Conversion en masse (optionnel mais recommandé)

Pour une meilleure expérience, on peut pré-convertir tous les fichiers en arrière-plan juste après le scan initial.

**Fonctionnement** :

```
Après le scan du dossier (Phase 1) :
1. Récupérer la liste de tous les .ydd trouvés
2. Filtrer ceux qui n'ont pas encore de .glb en cache
3. Lancer les conversions en file d'attente (2-3 en parallèle max)
4. Afficher une barre de progression dans l'interface
   ex: "Conversion des modèles : 45/623 (7%)"
5. L'utilisateur peut utiliser l'app pendant la conversion
6. Quand il clique sur un vêtement déjà converti → affichage instantané
   Quand il clique sur un non-converti → conversion à la demande + loader
```

**Avantage** : après la première utilisation, tout est en cache et l'affichage 3D est instantané.

---

## 7. Gestion des erreurs

| Situation | Comportement |
|-----------|-------------|
| Le CLI n'est pas trouvé | Message clair : "Outil de conversion manquant. Réinstallez l'application." |
| La conversion échoue sur un fichier | Afficher un message dans le viewer : "Impossible de charger ce modèle" + log de l'erreur pour debug |
| Le .glb est corrompu | Capturer l'erreur du GLTFLoader, proposer de reconvertir (supprimer le cache de ce fichier) |
| Le fichier .ydd n'a pas de .ytd associé | Tenter la conversion quand même (le modèle s'affichera sans texture, en gris) |
| Le disque est plein (cache trop gros) | Afficher la taille du cache dans les paramètres, bouton "Vider le cache" |

---

## 8. Dépendances Phase 3 (mises à jour)

| Besoin | Outil | Détail |
|--------|-------|--------|
| Rendu 3D | Threlte (@threlte/core, @threlte/extras) | Scène Svelte + Three.js |
| Chargement .glb | Three.js GLTFLoader | Natif, zéro config |
| Conversion .ydd → .glb | CW Model Convert (exe embarqué) | Appel via child_process |
| Cache | Node.js fs + path + app.getPath('userData') | Stockage local |
| Types Three.js | @types/three | Autocomplétion TypeScript |

**Ce qu'on n'a PLUS besoin de faire** :
- ~~Parser les fichiers .ydd manuellement~~
- ~~Parser les fichiers .ytd manuellement~~
- ~~Décoder les textures DDS~~
- ~~Gérer les VertexDeclarations~~
- ~~Porter du code CodeWalker en JavaScript~~

---

## 9. Estimation de la complexité

| Sous-étape | Difficulté | Temps estimé |
|------------|-----------|-------------|
| Intégrer le CLI + cache | Facile | 1-2 jours |
| Viewer Threlte basique | Facile | 1 jour |
| Charger un .glb dans le viewer | Trivial | Quelques heures |
| Connecter via IPC (clic → viewer) | Facile | 1 jour |
| Conversion en masse + progression | Moyen | 1-2 jours |
| Gestion d'erreurs + polish | Moyen | 1 jour |
| **Total** | | **~5-7 jours** |

Comparé à l'approche précédente (parser custom) qui aurait pris plusieurs semaines, c'est un gain énorme.
