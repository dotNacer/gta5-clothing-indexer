# YddConverter -- Documentation d'intégration

CLI qui convertit les fichiers GTA V `.ydd` (modèles 3D) et `.ytd` (textures) au format `.glb` (glTF binaire), lisible nativement par Three.js / Threlte via `GLTFLoader`.

## Fichier requis

Un seul fichier : **`YddConverter.exe`** (~66 Mo, self-contained).

Il embarque le runtime .NET et toutes les dépendances. Aucune installation de .NET, de GTA V, ou de CodeWalker n'est nécessaire sur la machine cible.

Chemin recommandé dans le projet Electron :

```
mon-app-electron/
├── resources/
│   └── bin/
│       └── YddConverter.exe
```

## Ligne de commande

```bash
# Modèle + texture (cas standard)
YddConverter.exe "<chemin>.ydd" "<chemin>.ytd"

# Modèle seul (rendu gris, sans texture)
YddConverter.exe "<chemin>.ydd"

# Avec chemin de sortie personnalisé
YddConverter.exe "<chemin>.ydd" "<chemin>.ytd" "<sortie>.glb"
```

### Arguments

| Position | Obligatoire | Description |
|----------|-------------|-------------|
| `args[0]` | oui | Chemin vers le fichier `.ydd` |
| `args[1]` | non | Chemin vers le fichier `.ytd` (textures) |
| `args[2]` | non | Chemin de sortie `.glb` |

Si `args[2]` n'est pas fourni, le `.glb` est créé dans le même dossier que le `.ydd`, avec le même nom de base (ex: `shirt.ydd` -> `shirt.glb`).

### Sortie

| Cas | Flux | Contenu | Exit code |
|-----|------|---------|-----------|
| Succès | stdout | `OK <chemin absolu du .glb>` | `0` |
| Erreur | stderr | Message d'erreur descriptif | `1` |

## Intégration Node.js / Electron (TypeScript)

```typescript
import { execFile } from "child_process";
import path from "path";
import { app } from "electron";

// En dev : chemin relatif au projet
// En production : dans le dossier resources de l'app packagée
function getConverterPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "bin", "YddConverter.exe");
  }
  return path.join(__dirname, "..", "resources", "bin", "YddConverter.exe");
}

/**
 * Convertit un fichier .ydd (+ optionnellement .ytd) en .glb
 *
 * @param yddPath - Chemin absolu vers le fichier .ydd
 * @param ytdPath - Chemin absolu vers le fichier .ytd (optionnel)
 * @param outputPath - Chemin de sortie .glb (optionnel, défaut = même dossier que le .ydd)
 * @returns Chemin absolu du fichier .glb généré
 */
function convertYddToGlb(
  yddPath: string,
  ytdPath?: string,
  outputPath?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [yddPath];
    if (ytdPath) args.push(ytdPath);
    if (outputPath) args.push(outputPath);

    execFile(
      getConverterPath(),
      args,
      { timeout: 30_000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message));
          return;
        }
        const glbPath = stdout.trim().replace(/^OK\s+/, "");
        resolve(glbPath);
      }
    );
  });
}
```

### Exemple d'utilisation

```typescript
// Conversion d'un seul fichier
const glbPath = await convertYddToGlb(
  "C:/FiveM/stream/shirt.ydd",
  "C:/FiveM/stream/shirt.ytd"
);
// glbPath = "C:\FiveM\stream\shirt.glb"

// Conversion avec sortie dans un dossier cache
const glbPath = await convertYddToGlb(
  "C:/FiveM/stream/pants.ydd",
  "C:/FiveM/stream/pants.ytd",
  "C:/MonApp/cache/pants.glb"
);

// Conversion batch (plusieurs fichiers en parallèle)
const files = [
  { ydd: "shirt.ydd", ytd: "shirt.ytd" },
  { ydd: "pants.ydd", ytd: "pants.ytd" },
  { ydd: "shoes.ydd", ytd: "shoes.ytd" },
];
const results = await Promise.all(
  files.map((f) => convertYddToGlb(f.ydd, f.ytd))
);
```

## Packaging Electron (electron-builder)

Dans `electron-builder.json` ou `package.json`, inclure le binaire dans les fichiers extra :

```json
{
  "extraResources": [
    {
      "from": "resources/bin/YddConverter.exe",
      "to": "bin/YddConverter.exe"
    }
  ]
}
```

Le fichier sera copié dans `<app>/resources/bin/YddConverter.exe` au moment du build.

## Formats de texture supportés

| Format | Support |
|--------|---------|
| DXT1 (BC1) | oui |
| DXT3 (BC2) | oui |
| DXT5 (BC3) | oui |
| BC4 (ATI1) | oui |
| BC5 (ATI2) | oui |
| BC7 | oui (via Pfim) |
| Non compressé (RGBA8, BGRA8, etc.) | oui |

Si une texture ne peut pas être décodée, la géométrie correspondante est rendue avec un matériau gris par défaut.

## Limitations connues

- **Windows uniquement** : le binaire est compilé pour win-x64
- **Pas de squelette/bones** : le modèle exporté est statique (pas d'animation)
- **LOD High uniquement** : seul le niveau de détail le plus élevé est exporté (avec fallback automatique vers Med/Low si High est absent)
- **Timeout** : pour des fichiers très volumineux, augmenter le timeout du `execFile`

## Aucune dépendance externe requise

- Pas besoin de .NET installé
- Pas besoin de GTA V installé
- Pas besoin de fichiers du jeu (RPF, etc.)
- Les fichiers `.ydd` / `.ytd` sont lus directement (format FiveM standalone)
