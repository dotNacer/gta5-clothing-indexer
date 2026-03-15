import type { ClothingItem } from '../../../shared/types'

let selectedItem = $state<ClothingItem | null>(null)
let glbUrl = $state<string | null>(null)
let isConverting = $state(false)
let error = $state<string | null>(null)

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

    async selectItem(item: ClothingItem) {
      if (selectedItem?.id === item.id) return

      selectedItem = item
      glbUrl = null
      error = null
      isConverting = true

      try {
        const ytdPath = item.ytdPaths.length > 0 ? item.ytdPaths[0] : undefined
        const result = await window.api.convertClothing(item.yddPath!, ytdPath)

        if (selectedItem?.id !== item.id) return

        if (result.error) {
          error = result.error
        } else if (result.glbUrl) {
          glbUrl = result.glbUrl
        }
      } catch (err) {
        if (selectedItem?.id !== item.id) return
        error = err instanceof Error ? err.message : String(err)
      } finally {
        if (selectedItem?.id === item.id) {
          isConverting = false
        }
      }
    },

    closeViewer() {
      selectedItem = null
      glbUrl = null
      isConverting = false
      error = null
    }
  }
}
