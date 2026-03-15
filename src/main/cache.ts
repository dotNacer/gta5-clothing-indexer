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

export function getGlbPath(yddFileName: string): string {
  const baseName = yddFileName.replace(/\.ydd$/i, '')
  return path.join(getCacheDir(), `${baseName}.glb`)
}

export function isConverted(yddFileName: string): boolean {
  return fs.existsSync(getGlbPath(yddFileName))
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
