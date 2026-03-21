import type { ClothingItem } from '../../../shared/types'

let selectedItem = $state<ClothingItem | null>(null)
let glbUrl = $state<string | null>(null)
let isConverting = $state(false)
let error = $state<string | null>(null)
let activeTextureIndex = $state(0)
let loadTimeMs = $state<number | null>(null)
let conversionSeq = 0

async function convert(item: ClothingItem, ytdIndex: number): Promise<void> {
  const seq = ++conversionSeq
  glbUrl = null
  error = null
  isConverting = true
  loadTimeMs = null
  const startTime = performance.now()

  try {
    const ytdPath = item.ytdPaths.length > ytdIndex ? item.ytdPaths[ytdIndex] : undefined
    const result = await window.api.convertClothing(item.yddPath!, ytdPath)

    if (conversionSeq !== seq) return

    if (result.error) {
      error = result.error
    } else if (result.glbUrl) {
      glbUrl = result.glbUrl
      loadTimeMs = Math.round(performance.now() - startTime)
    }
  } catch (err) {
    if (conversionSeq !== seq) return
    error = err instanceof Error ? err.message : String(err)
  } finally {
    if (conversionSeq === seq) isConverting = false
  }
}

export function getViewerStore() {
  return {
    get selectedItem() {
      return selectedItem
    },
    get glbUrl() {
      return glbUrl
    },
    get isConverting() {
      return isConverting
    },
    get error() {
      return error
    },
    get isOpen() {
      return selectedItem !== null
    },
    get activeTextureIndex() {
      return activeTextureIndex
    },
    get loadTimeMs() {
      return loadTimeMs
    },
    get ytdPaths() {
      return selectedItem?.ytdPaths ?? []
    },

    async selectItem(item: ClothingItem) {
      if (selectedItem?.id === item.id) return
      selectedItem = item
      activeTextureIndex = 0
      await convert(item, 0)
    },

    async selectTexture(index: number) {
      if (!selectedItem || index === activeTextureIndex) return
      if (index < 0 || index >= selectedItem.ytdPaths.length) return
      activeTextureIndex = index
      await convert(selectedItem, index)
    },

    closeViewer() {
      selectedItem = null
      glbUrl = null
      isConverting = false
      error = null
      activeTextureIndex = 0
      loadTimeMs = null
      conversionSeq++
    }
  }
}
