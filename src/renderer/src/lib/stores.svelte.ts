import type { ClothingItem, ExportResult } from '../../../shared/types'
import { getThumbnailStore } from './thumbnails.svelte'

let clothingItems = $state<ClothingItem[]>([])
let searchQuery = $state('')
let genderFilter = $state<'all' | 'male' | 'female'>('all')
let categoryFilter = $state<string>('all')
let folderPath = $state<string | null>(null)
let isScanning = $state(false)
let selectedForExport = $state(new Set<string>())
let isExporting = $state(false)
let lastExportResult = $state<ExportResult | null>(null)
let showExportPreview = $state(false)
let exportProgress = $state<{ copied: number; total: number } | null>(null)
let categoryOffsets = $state<Record<string, number>>({})

const filteredItems = $derived.by(() => {
  let result = clothingItems

  if (genderFilter !== 'all') {
    result = result.filter((item) => item.gender === genderFilter)
  }

  if (categoryFilter !== 'all') {
    result = result.filter((item) => item.category === categoryFilter)
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    result = result.filter(
      (item) =>
        item.fileName.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
  }

  return result
})

const availableCategories = $derived.by(() => {
  const cats = new Map<string, string>()
  for (const item of clothingItems) {
    if (!cats.has(item.category)) {
      cats.set(item.category, item.categoryLabel)
    }
  }
  return Array.from(cats.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, label]) => ({ code, label }))
})

const totalCount = $derived(clothingItems.length)
const filteredCount = $derived(filteredItems.length)
const selectedForExportCount = $derived(selectedForExport.size)
const selectedExportItems = $derived.by(() =>
  clothingItems.filter((i) => selectedForExport.has(i.id))
)

export function getStore() {
  return {
    get clothingItems() {
      return clothingItems
    },
    get searchQuery() {
      return searchQuery
    },
    set searchQuery(value: string) {
      searchQuery = value
    },
    get genderFilter() {
      return genderFilter
    },
    set genderFilter(value: 'all' | 'male' | 'female') {
      genderFilter = value
    },
    get categoryFilter() {
      return categoryFilter
    },
    set categoryFilter(value: string) {
      categoryFilter = value
    },
    get folderPath() {
      return folderPath
    },
    get isScanning() {
      return isScanning
    },
    get filteredItems() {
      return filteredItems
    },
    get availableCategories() {
      return availableCategories
    },
    get totalCount() {
      return totalCount
    },
    get filteredCount() {
      return filteredCount
    },
    get selectedForExport() {
      return selectedForExport
    },
    get selectedForExportCount() {
      return selectedForExportCount
    },
    get selectedExportItems() {
      return selectedExportItems
    },
    get isExporting() {
      return isExporting
    },
    get lastExportResult() {
      return lastExportResult
    },
    get showExportPreview() {
      return showExportPreview
    },
    get exportProgress() {
      return exportProgress
    },
    get categoryOffsets() {
      return categoryOffsets
    },
    setCategoryOffset(category: string, offset: number) {
      categoryOffsets = { ...categoryOffsets, [category]: offset }
    },

    toggleExportSelection(itemId: string) {
      const next = new Set(selectedForExport)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      selectedForExport = next
    },

    selectAllFiltered() {
      const next = new Set(selectedForExport)
      for (const item of filteredItems) {
        next.add(item.id)
      }
      selectedForExport = next
    },

    clearExportSelection() {
      selectedForExport = new Set()
    },

    isSelectedForExport(itemId: string): boolean {
      return selectedForExport.has(itemId)
    },

    requestExport() {
      const items = clothingItems.filter((i) => selectedForExport.has(i.id))
      if (items.length === 0) return
      showExportPreview = true
    },

    cancelExportPreview() {
      showExportPreview = false
      categoryOffsets = {}
    },

    async confirmAndExport(): Promise<ExportResult | null> {
      showExportPreview = false
      const items = clothingItems.filter((i) => selectedForExport.has(i.id))
      if (items.length === 0) return null

      isExporting = true
      lastExportResult = null
      exportProgress = null

      const unsubscribe = window.api.onExportProgress?.((data) => {
        exportProgress = data
      })

      try {
        const result = await window.api.exportItems($state.snapshot(items), { ...categoryOffsets })
        if (result) {
          lastExportResult = result
          selectedForExport = new Set()
          categoryOffsets = {}
        }
        return result
      } finally {
        unsubscribe?.()
        exportProgress = null
        isExporting = false
      }
    },

    dismissExportResult() {
      lastExportResult = null
    },

    async selectAndScan() {
      const selected = await window.api.selectFolder()
      if (!selected) return

      folderPath = selected
      isScanning = true
      getThumbnailStore().clear()
      try {
        clothingItems = await window.api.scanFolder(selected)
      } finally {
        isScanning = false
      }
    },

    resetFilters() {
      searchQuery = ''
      genderFilter = 'all'
      categoryFilter = 'all'
    }
  }
}
