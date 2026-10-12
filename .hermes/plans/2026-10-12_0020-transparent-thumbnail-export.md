# Transparent Clothing Thumbnail Export Implementation Plan

> **For Hermes:** Implement with TDD and verify the Electron build.

**Goal:** Extend `gta5-clothing-indexer` so it batch-converts indexed `.ydd`/`.ytd` pairs to transparent PNG thumbnails without FiveM or CodeWalker.

**Architecture:** Reuse the shipped `YddConverter.exe` to produce GLB files. The Electron renderer uses Three.js `WebGLRenderer` with alpha enabled, an auto-framed perspective camera and neutral lights to render each isolated clothing GLB into a 512×512 transparent PNG. The main process owns directory selection and atomic writes; it writes a JSON manifest alongside images so source files remain traceable.

**Scope:** One image per indexed YDD, using its first paired YTD. No ped/skeleton composition; no automatic BlankaaCreator runtime-index mapping. Output uses source-based safe filenames and a manifest.

**Tests / validation:** Test job selection and safe filename behavior before implementation; run test, lint and TypeScript checks. The Windows-only converter/render pipeline cannot be exercised on the Linux host, so actual output is validated by running the packaged app on a Windows machine.

---

### Task 1: Define export jobs with tests
- Create a pure shared helper that converts valid indexed clothing entries into deterministic thumbnail jobs.
- Add tests for filtering incomplete assets, source-based PNG names and the first texture selection.

### Task 2: Add a transparent Three.js renderer
- Add a renderer helper that loads `glb://` assets, fits camera from bounding box, renders against alpha=0 and disposes GPU resources.
- Return PNG data URLs only.

### Task 3: Add constrained main-process export APIs
- Let user choose an output directory.
- Persist base64 PNGs only under that directory, with safe generated filenames.
- Persist a `thumbnails-index.json` manifest atomically.

### Task 4: Add batch-export UI and progress
- Add an explicit export action, progress/errors and cancellation-safe sequential processing.
- Convert, render and persist every job without blocking the interactive viewer.

### Task 5: Validate and document
- Run unit tests, lint and typecheck.
- Document the output convention and Windows-only runtime validation.
