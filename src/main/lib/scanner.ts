import { readdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import type { ScannedFile } from '../../shared/types'

const VALID_EXTENSIONS = new Set(['.ydd', '.ytd'])

export async function scanFolder(folderPath: string): Promise<ScannedFile[]> {
  const entries = await readdir(folderPath, { withFileTypes: true, recursive: true })
  const results: ScannedFile[] = []

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const ext = extname(entry.name).toLowerCase()
    if (!VALID_EXTENSIONS.has(ext)) continue

    const fullPath = join(entry.parentPath ?? entry.path, entry.name)
    results.push({
      name: basename(entry.name, ext),
      path: fullPath,
      ext: ext as '.ydd' | '.ytd'
    })
  }

  return results
}
