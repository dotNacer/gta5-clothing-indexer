<script lang="ts">
  import Header from './components/Header.svelte'
  import FilterBar from './components/FilterBar.svelte'
  import ClothingGrid from './components/ClothingGrid.svelte'
  import EmptyState from './components/EmptyState.svelte'
  import Viewer3D from './components/Viewer3D.svelte'
  import ExportBar from './components/ExportBar.svelte'
  import ExportToast from './components/ExportToast.svelte'
  import ExportPreview from './components/ExportPreview.svelte'
  import { getStore } from './lib/stores.svelte'
  import { getViewerStore } from './lib/viewer.svelte'
  import { computeExportPreview } from '../../shared/exportUtils'

  const store = getStore()
  const viewer = getViewerStore()

  const exportPreviewGroups = $derived(
    store.showExportPreview ? computeExportPreview(store.selectedExportItems) : []
  )

  const viewerLabel = $derived(
    viewer.selectedItem
      ? `${viewer.selectedItem.categoryLabel} #${String(viewer.selectedItem.componentNum).padStart(3, '0')}`
      : ''
  )
</script>

<div class="h-screen flex flex-col bg-[#0a0a0b] text-stone-100 overflow-hidden">
  <Header
    searchQuery={store.searchQuery}
    folderPath={store.folderPath}
    isScanning={store.isScanning}
    onSelectFolder={() => store.selectAndScan()}
    onSearchChange={(v) => (store.searchQuery = v)}
  />

  {#if store.totalCount > 0}
    <FilterBar
      genderFilter={store.genderFilter}
      categoryFilter={store.categoryFilter}
      availableCategories={store.availableCategories}
      totalCount={store.totalCount}
      filteredCount={store.filteredCount}
      onGenderChange={(v) => (store.genderFilter = v)}
      onCategoryChange={(v) => (store.categoryFilter = v)}
    />
    <div class="flex-1 flex min-h-0">
      <div
        class="transition-all duration-300 ease-in-out min-h-0 flex flex-col {viewer.isOpen
          ? 'w-2/5'
          : 'w-full'}"
      >
        <ClothingGrid
          items={store.filteredItems}
          selectedItemId={viewer.selectedItem?.id}
          selectedForExport={store.selectedForExport}
          onSelect={(item) => viewer.selectItem(item)}
          onToggleExport={(item) => store.toggleExportSelection(item.id)}
        />
      </div>
      {#if viewer.isOpen}
        <div class="w-3/5 border-l border-white/[0.06] min-h-0">
          <Viewer3D
            glbUrl={viewer.glbUrl}
            isConverting={viewer.isConverting}
            error={viewer.error}
            itemLabel={viewerLabel}
            onClose={() => viewer.closeViewer()}
          />
        </div>
      {/if}
    </div>
  {:else if store.isScanning}
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <svg
          class="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <p class="text-sm text-stone-500">Indexation en cours...</p>
      </div>
    </div>
  {:else}
    <EmptyState onSelectFolder={() => store.selectAndScan()} />
  {/if}

  <ExportBar
    selectedCount={store.selectedForExportCount}
    isExporting={store.isExporting}
    onSelectAll={() => store.selectAllFiltered()}
    onClearSelection={() => store.clearExportSelection()}
    onExport={() => store.requestExport()}
    exportProgress={store.exportProgress}
  />

  {#if store.showExportPreview}
    <ExportPreview
      groups={exportPreviewGroups}
      onConfirm={() => store.confirmAndExport()}
      onCancel={() => store.cancelExportPreview()}
    />
  {/if}

  {#if store.lastExportResult}
    <ExportToast result={store.lastExportResult} onDismiss={() => store.dismissExportResult()} />
  {/if}
</div>
