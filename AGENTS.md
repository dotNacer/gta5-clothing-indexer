# AGENTS.md

## Cursor Cloud specific instructions

### Overview

GTA5 Clothing Indexer — an Electron desktop app (Svelte 5 + TypeScript + Tailwind CSS v4) that scans a local folder of GTA V / FiveM clothing files (`.ydd` / `.ytd`) and displays them in a filterable grid with optional 3D preview.

### Running the app

- **Dev mode**: `npm run dev` (runs `electron-vite dev` — starts main, preload, and renderer with HMR)
- Electron requires a display. On headless Linux, start Xvfb first:
  ```
  Xvfb :99 -screen 0 1280x720x24 &
  DISPLAY=:99 npm run dev
  ```
- DBus and GPU errors in Xvfb output are harmless and can be ignored.

### Standard commands

See `package.json` scripts for the full list. Key ones:

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run lint` | ESLint (includes Svelte plugin) |
| `npm run typecheck` | TypeScript check (tsc + svelte-check) |
| `npm run format` | Prettier formatting |
| `npm run build` | Production build (typecheck + electron-vite build) |
| `npm run build:linux` | Build distributable for Linux |

### Gotchas

- The repo has pre-existing lint errors (unused imports, Svelte `{#each}` key warnings, prettier formatting) and a typecheck error (`getCacheDir` unused import in `converter.ts`). These are **not** regressions.
- `YddConverter.exe` (Windows .NET binary for `.ydd` → `.glb` conversion) is not in the repo. The 3D viewer feature will not work without it, but the core scanning/indexing/filtering UI works fine.
- Tailwind CSS v4 uses the Vite plugin approach (`@tailwindcss/vite`) — there is no `tailwind.config.js`.
- The UI is in French (e.g., "Choisir un dossier" = "Choose a folder").
- To test folder scanning, create dummy `.ydd`/`.ytd` files in a temp directory (e.g., `/tmp/test-clothing/mp_m_freemode_01_mp_m_hoodie_001.ydd`).
