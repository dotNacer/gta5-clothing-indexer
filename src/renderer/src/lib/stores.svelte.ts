import type { ClothingItem, ExportResult } from '../../../shared/types'

let clothingItems = $state<ClothingItem[]>([])
let searchQuery = $state('')
let genderFilter = $state<'all' | 'male' | 'female'>('all')
let categoryFilter = $state<string>('all')
let folderPath = $state<string | null>(null)
let isScanning = $state(false)
let selectedForExport = $state(new Set<string>())
let isExporting = $state(false)
let lastExportResult = $state<ExportResult | null>(null)

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

    toggleExportSelection(itemId: string) {
      if (selectedForExport.has(itemId)) {
        selectedForExport.delete(itemId)
      } else {
        selectedForExport.add(itemId)
      }
    },

    selectAllFiltered() {
      for (const item of filteredItems) {
        selectedForExport.add(item.id)
      }
    },

    clearExportSelection() {
      selectedForExport.clear()
    },

    isSelectedForExport(itemId: string): boolean {
      return selectedForExport.has(itemId)
    },

    async exportSelected(): Promise<ExportResult | null> {
      const items = clothingItems.filter((i) => selectedForExport.has(i.id))
      if (items.length === 0) return null

      isExporting = true
      lastExportResult = null
      try {
        const result = await window.api.exportItems(items)
        if (result) {
          lastExportResult = result
          selectedForExport.clear()
        }
        return result
      } finally {
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
