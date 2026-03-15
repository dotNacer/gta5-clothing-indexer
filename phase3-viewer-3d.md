# Phase 3 — Viewer 3D : Document Technique Détaillé

## 1. Objectif

Permettre à l'utilisateur de cliquer sur un vêtement dans la grille et de voir son modèle 3D s'afficher dans un panneau interactif, avec sa texture appliquée, dans un viewer intégré à l'application.

---

## 2. Le défi : comprendre les fichiers RAGE

Les fichiers .ydd et .ytd sont des formats binaires propriétaires du moteur RAGE (Rockstar Advanced Game Engine). Ils ne sont pas directement lisibles par Three.js ou tout autre moteur 3D standard. Il faut donc les **parser** (décoder) pour en extraire les données exploitables.

### 2.1. Fichier .YDD (modèle 3D)

Un fichier .ydd contient une ou plusieurs **drawables** (objets dessinables). Chaque drawable contient :

- **Geometries** : les formes 3D du vêtement
  - **Vertices** : les points 3D (positions x, y, z)
  - **Normales** : les directions perpendiculaires à chaque face (utilisées pour l'éclairage)
  - **UV Maps** : les coordonnées de texture (comment la texture 2D s'enroule sur le modèle 3D)
  - **Indices** : l'ordre dans lequel les vertices forment des triangles (faces)
- **Shader Group** : référence au matériau/shader utilisé et à la texture associée
- **Bounding Box / Bounding Sphere** : les limites spatiales du modèle (utile pour centrer la caméra)
- **Skeleton / Bones** (optionnel) : données d'armature pour l'animation — on peut les ignorer pour un simple viewer statique

### 2.2. Fichier .YTD (textures)

Un fichier .ytd est un dictionnaire de textures. Il contient :

- **Une ou plusieurs textures** nommées
- Chaque texture est une image au format **DDS** (DirectDraw Surface)
  - Peut utiliser différentes compressions : DXT1, DXT3, DXT5, BC7, etc.
  - Contient parfois des **mipmaps** (versions basse résolution de la même texture)
- Informations par texture : largeur, hauteur, format de compression, nombre de mipmaps, données brutes des pixels

---

## 3. Pipeline complète : du fichier brut au rendu 3D

```
Fichier .ytd                          Fichier .ydd
    │                                      │
    ▼                                      ▼
┌─────────────┐                    ┌──────────────┐
│ Parser YTD  │                    │  Parser YDD  │
│             │                    │              │
│ Lire header │                    │ Lire header  │
│ Extraire    │                    │ Extraire     │
│ textures DDS│                    │ geometries   │
└──────┬──────┘                    └──────┬───────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                    ┌──────────────┐
│ Décodeur DDS│                    │ Convertisseur│
│             │                    │              │
│ DXT1/DXT5 → │                    │ Vertices  ──►│ Float32Array
│ pixels RGBA │                    │ Normales  ──►│ Float32Array
└──────┬──────┘                    │ UVs       ──►│ Float32Array
       │                           │ Indices   ──►│ Uint16Array
       ▼                           └──────┬───────┘
┌─────────────┐                           │
│ Three.js    │                           ▼
│ Texture     │                    ┌──────────────┐
│             │                    │ Three.js     │
│ DataTexture │                    │ BufferGeom.  │
│ ou          │                    │              │
│ Compressed  │                    │ setAttribute │
│ Texture     │                    │ (position,   │
└──────┬──────┘                    │  normal, uv, │
       │                           │  index)      │
       │                           └──────┬───────┘
       │                                  │
       ▼                                  ▼
┌─────────────────────────────────────────────┐
│              Three.js Scene                  │
│                                              │
│  Material = MeshStandardMaterial {           │
│    map: texture (diffuse)                    │
│    normalMap: texture (si disponible)        │
│    roughness, metalness: valeurs par défaut  │
│  }                                           │
│                                              │
│  Mesh = new Mesh(geometry, material)         │
│                                              │
│  + Lumières (ambient + directional)          │
│  + Caméra orbitable                          │
│  + Fond neutre                               │
└──────────────────────────────────────────────┘
```

---

## 4. Étapes de développement détaillées

### Étape 4.1 — Parser YTD (extraction des textures)

**But** : lire un fichier .ytd et en extraire les images de texture utilisables.

**Comment ça marche** :
1. Lire le fichier en tant que buffer binaire (via Node.js `fs.readFile`)
2. Lire le **header RSC7** (en-tête commun à tous les fichiers RAGE) — il indique les offsets et tailles des données
3. Éventuellement **décompresser** le contenu (les fichiers RAGE peuvent être compressés en LZ4 ou zlib)
4. Parcourir la **table des textures** qui liste chaque texture avec son nom, ses dimensions, son format et l'offset vers ses données
5. Pour chaque texture, extraire les **données brutes DDS**
6. Décoder le DDS selon son format de compression (DXT1, DXT5, BC7...) en pixels RGBA

**Ressources de référence** :
- Code source de CodeWalker : `GameFiles/FileTypes/YtdFile.cs` et `TextureDictionary.cs`
- Documentation communautaire sur le wiki GTAMods : format RSC7, structure des TextureDictionary
- Le format DDS est un standard Microsoft, bien documenté

**Sortie** : pour chaque texture → un objet `{ name, width, height, rgbaPixels }` exploitable par Three.js

---

### Étape 4.2 — Parser YDD (extraction des modèles)

**But** : lire un fichier .ydd et en extraire les données géométriques du mesh.

**Comment ça marche** :
1. Lire le fichier en tant que buffer binaire
2. Lire le **header RSC7** et décompresser si nécessaire (même logique que pour YTD)
3. Naviguer vers la structure **DrawableModel** qui contient les géométries
4. Pour chaque géométrie, lire :
   - Le **vertex buffer** : tableau de vertices, chacun contenant position (x,y,z), normale (nx,ny,nz), et coordonnées UV (u,v)
   - Le **index buffer** : tableau d'indices qui définissent les triangles
   - Le **vertex declaration** : décrit le format exact de chaque vertex (quels attributs sont présents, leur taille, leur ordre) — c'est crucial car le format des vertices peut varier d'un modèle à l'autre
5. Extraire le nom de la texture référencée par le shader group (pour savoir quelle texture du .ytd appliquer)

**Ressources de référence** :
- Code source de CodeWalker : `GameFiles/FileTypes/YddFile.cs`, `DrawableModel.cs`, `VertexBuffer.cs`
- Wiki GTAMods : structure Drawable, formats de vertex

**Sortie** : pour chaque géométrie → `{ positions[], normals[], uvs[], indices[], textureName }`

---

### Étape 4.3 — Conversion vers Three.js

**But** : transformer les données extraites en objets Three.js affichables.

**Pour la géométrie** :
- Créer un `BufferGeometry`
- Ajouter les attributs :
  - `position` → `Float32BufferAttribute` depuis le tableau de positions
  - `normal` → `Float32BufferAttribute` depuis le tableau de normales
  - `uv` → `Float32BufferAttribute` depuis le tableau d'UVs
  - `index` → `BufferAttribute` depuis le tableau d'indices
- Si les normales sont absentes, les recalculer avec `geometry.computeVertexNormals()`

**Pour la texture** :
- Créer un `DataTexture` à partir des pixels RGBA décodés
- Configurer : `texture.flipY = true`, filtrage, wrapping
- Alternative pour les textures DDS compressées : utiliser `CompressedTexture` directement (évite de décompresser côté CPU, la GPU le fait nativement — plus performant)

**Pour le matériau** :
- Créer un `MeshStandardMaterial` avec la texture en `map`
- Réglages par défaut : `roughness: 0.7`, `metalness: 0.1` (bon rendu pour des vêtements)

**Assembler** :
- `new THREE.Mesh(geometry, material)` → l'objet 3D final

---

### Étape 4.4 — Scène et viewer interactif (via Threlte)

**But** : afficher le mesh dans un panneau 3D interactif intégré à l'app Svelte.

**Composants Threlte à utiliser** :
- `<Canvas>` : le conteneur 3D principal
- `<T.PerspectiveCamera>` : caméra avec perspective
- `<OrbitControls>` : contrôles souris pour orbiter, zoomer, déplacer
- `<T.AmbientLight>` : lumière ambiante douce
- `<T.DirectionalLight>` : lumière directionnelle pour les ombres/reliefs
- `<T.Mesh>` : le mesh du vêtement

**Comportement attendu** :
- Au clic sur un vêtement dans la grille → le viewer charge et affiche le modèle
- La caméra se positionne automatiquement en fonction de la bounding box du modèle (pour que le vêtement soit bien cadré, ni trop loin ni trop près)
- L'utilisateur peut tourner autour du modèle (clic gauche + drag), zoomer (molette), et déplacer la vue (clic droit + drag)
- Un fond neutre (gris foncé ou dégradé) pour bien voir le vêtement
- Indicateur de chargement pendant le parsing du fichier

---

## 5. Format de vertex — Point d'attention important

Le format des vertices dans les fichiers .ydd n'est pas fixe. Chaque géométrie a un **vertex declaration** qui décrit la structure exacte d'un vertex. Les attributs possibles sont :

| Attribut | Description | Taille typique |
|----------|-------------|----------------|
| Position | x, y, z | 12 bytes (3 × float32) |
| Normal | nx, ny, nz | 4-12 bytes (compressé ou float) |
| Color | r, g, b, a | 4 bytes |
| TexCoord0 | u, v | 4-8 bytes (float16 ou float32) |
| TexCoord1 | u, v (2e jeu d'UVs) | 4-8 bytes |
| Tangent | tx, ty, tz, tw | 4-16 bytes |
| BlendWeights | poids pour le skinning | 4 bytes |
| BlendIndices | indices de bones | 4 bytes |

Le parser doit lire le vertex declaration d'abord, puis interpréter chaque vertex en conséquence. C'est le point le plus délicat du parsing — si on se trompe ici, le modèle sera déformé ou invisible.

---

## 6. Gestion de la mémoire et performance

- **Parsing à la demande** : ne parser un fichier .ydd que quand l'utilisateur clique dessus (pas au scan initial)
- **Cache des modèles parsés** : garder en mémoire les derniers modèles consultés (LRU cache de ~20 modèles) pour éviter de re-parser si l'utilisateur y revient
- **Libération des ressources Three.js** : quand un modèle est déchargé du cache, appeler `geometry.dispose()` et `texture.dispose()` pour libérer la mémoire GPU
- **Web Workers** : effectuer le parsing binaire dans un Worker pour ne pas bloquer l'interface pendant le décodage d'un gros fichier

---

## 7. Résumé des dépendances Phase 3

| Besoin | Outil | Détail |
|--------|-------|--------|
| Rendu 3D | Threlte (wrapper Svelte pour Three.js) | Scène, caméra, contrôles |
| Géométries | Three.js BufferGeometry | Stockage optimisé des meshes |
| Textures | Three.js DataTexture / CompressedTexture | Affichage des textures DDS |
| Décompression LZ4/zlib | Bibliothèque JS (lz4js, pako) | Décompresser les fichiers RAGE |
| Parsing binaire | DataView / Buffer natif JS | Lecture des structures binaires |
| Référence de parsing | Code source CodeWalker (C#, open-source) | Pour comprendre la structure exacte des fichiers |

---

## 8. Risques et solutions

| Risque | Impact | Solution |
|--------|--------|----------|
| Le format de vertex varie entre fichiers | Modèles déformés ou crash | Lire le vertex declaration systématiquement, ne pas hardcoder le format |
| Certains fichiers utilisent des compressions DDS rares (BC7) | Texture noire ou absente | Implémenter les formats DDS les plus courants d'abord (DXT1, DXT5), ajouter les autres progressivement |
| Les fichiers .ydd avec skeleton/bones | Complexité supplémentaire | Ignorer les données de squelette, ne garder que la géométrie statique (pose T-pose ou A-pose) |
| Fichiers corrompus ou non-standard | Crash du parser | Try/catch systématique, afficher un message d'erreur clair au lieu de planter |
| Parsing lent sur de gros fichiers | Interface figée | Utiliser des Web Workers pour parser en arrière-plan |
