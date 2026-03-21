import type { ClothingItem } from '../../../shared/types'
import { renderThumbnail } from './thumbnailRenderer'

const CONCURRENCY = 3
const LOADING_SENTINEL = '\0'

let cache = $state<Record<string, string>>({})
let queue: ClothingItem[] = []
let running = 0
let pending = new Set<string>()

function processQueue(): void {
  while (running < CONCURRENCY && queue.length > 0) {
    const item = queue.shift()!
    if (cache[item.id] && cache[item.id] !== LOADING_SENTINEL) continue
    if (!item.yddPath) continue

    running++
    generate(item).finally(() => {
      running--
      processQueue()
    })
  }
}

async function generate(item: ClothingItem): Promise<void> {
  let glbUrl: string | undefined
  try {
    const ytdPath = item.ytdPaths.length > 0 ? item.ytdPaths[0] : undefined
    const result = await window.api.convertClothing(item.yddPath!, ytdPath)
    if (result.error || !result.glbUrl) return

    glbUrl = result.glbUrl
    cache[item.id] = await renderThumbnail(glbUrl)
  } catch {
    delete cache[item.id]
  } finally {
    pending.delete(item.id)
    if (glbUrl) {
      window.api.releaseGlb(glbUrl).catch(() => {})
    }
  }
}

export function getThumbnailStore() {
  return {
    get(itemId: string): string | null {
      const v = cache[itemId]
      return v && v !== LOADING_SENTINEL ? v : null
    },

    isLoading(itemId: string): boolean {
      return cache[itemId] === LOADING_SENTINEL
    },

    request(item: ClothingItem): void {
      if (cache[item.id] || pending.has(item.id) || !item.yddPath) return
      pending.add(item.id)
      cache[item.id] = LOADING_SENTINEL
      queue.push(item)
      processQueue()
    },

    clear(): void {
      cache = {}
      pending.clear()
      queue.length = 0
    }
  }
}
