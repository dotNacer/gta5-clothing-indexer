import { app } from 'electron'
import path from 'path'
import fs from 'fs'

let cacheDir: string | null = null

export function getCacheDir(): string {
  if (!cacheDir) {
    cacheDir = path.join(app.getPath('userData'), 'cache', 'glb')
    fs.mkdirSync(cacheDir, { recursive: true })
  }
  return cacheDir
}

function sanitizeForFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9_.-]/g, '_')
}

export function getGlbPath(yddFileName: string, ytdFileName?: string): string {
  const baseName = yddFileName.replace(/\.ydd$/i, '')
  if (!ytdFileName) {
    return path.join(getCacheDir(), `${baseName}.glb`)
  }
  const ytdBase = sanitizeForFilename(ytdFileName.replace(/\.ytd$/i, ''))
  return path.join(getCacheDir(), `${baseName}_${ytdBase}.glb`)
}

export function isConverted(yddFileName: string, ytdFileName?: string): boolean {
  return fs.existsSync(getGlbPath(yddFileName, ytdFileName))
}

export function removeGlb(glbFileName: string): void {
  const filePath = path.join(getCacheDir(), glbFileName)
  fs.unlink(filePath, () => {})
}

export function clearCache(): void {
  const dir = getCacheDir()
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.glb')) {
      fs.unlinkSync(path.join(dir, file))
    }
  }
}

export function getCacheSize(): number {
  const dir = getCacheDir()
  let total = 0
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.glb')) {
      total += fs.statSync(path.join(dir, file)).size
    }
  }
  return total
}
