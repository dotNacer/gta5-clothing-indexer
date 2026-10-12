import type { ClothingItem } from './types'

export interface ThumbnailJob {
  id: string
  yddPath: string
  ytdPath: string
  outputFileName: string
  category: string
  gender: ClothingItem['gender']
}

function safeOutputFileName(fileName: string): string {
  const normalized = fileName
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^[_./-]+|[_./-]+$/g, '')

  return `${normalized || 'clothing'}.png`
}

export function createThumbnailJobs(items: ClothingItem[]): ThumbnailJob[] {
  return items
    .filter((item): item is ClothingItem & { yddPath: string } => Boolean(item.yddPath && item.ytdPaths[0]))
    .map((item) => ({
      id: item.id,
      yddPath: item.yddPath,
      ytdPath: item.ytdPaths[0],
      outputFileName: safeOutputFileName(item.fileName),
      category: item.category,
      gender: item.gender
    }))
}
