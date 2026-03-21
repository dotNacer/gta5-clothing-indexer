<script lang="ts">
  import Sidebar from './components/Sidebar.svelte'
  import Toolbar from './components/Toolbar.svelte'
  import ClothingGrid from './components/ClothingGrid.svelte'
  import EmptyState from './components/EmptyState.svelte'
  import Viewer3D from './components/Viewer3D.svelte'
  import ExportDock from './components/ExportDock.svelte'
  import ExportPreview from './components/ExportPreview.svelte'
  import DragGhost from './components/DragGhost.svelte'
  import { Toaster, toast } from 'svelte-sonner'
  import { getStore } from './lib/stores.svelte'
  import { getViewerStore } from './lib/viewer.svelte'
  import { computeExportPreview } from '../../shared/exportUtils'

  const store = getStore()
  const viewer = getViewerStore()

  const exportPreviewGroups = $derived(
    store.showExportPreview ? computeExportPreview(store.selectedExportItems, store.categoryOffsets) : []
  )

  const viewerLabel = $derived(
    viewer.selectedItem
      ? `${viewer.selectedItem.categoryLabel} #${String(viewer.selectedItem.componentNum).padStart(3, '0')}`
      : ''
  )

  // Viewer panel resize
  let viewerWidth = $state(55) // percentage
  let isResizing = $state(false)

  function onResizeStart(e: MouseEvent) {
    e.preventDefault()
    isResizing = true
    const startX = e.clientX
    const startWidth = viewerWidth

    function onMouseMove(ev: MouseEvent) {
      const mainArea = document.getElementById('main-content')
      if (!mainArea) return
      const rect = mainArea.getBoundingClientRect()
      const dx = startX - ev.clientX
      const pct = startWidth + (dx / rect.width) * 100
      viewerWidth = Math.max(30, Math.min(70, pct))
    }

    function onMouseUp() {
      isResizing = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Handle export result with Sonner toasts
  $effect(() => {
    const result = store.lastExportResult
    if (!result) return

    if (result.errors.length > 0) {
      toast.warning(`${result.exportedFiles} fichier${result.exportedFiles > 1 ? 's' : ''} exporté${result.exportedFiles > 1 ? 's' : ''} avec ${result.errors.length} erreur${result.errors.length > 1 ? 's' : ''}`, {
        description: result.outputFolder,
        duration: 6000
      })
    } else {
      toast.success(`${result.exportedFiles} fichier${result.exportedFiles > 1 ? 's' : ''} exporté${result.exportedFiles > 1 ? 's' : ''}`, {
        description: result.outputFolder,
        duration: 4000
      })
    }
    store.dismissExportResult()
  })
</script>

<Toaster
  position="top-right"
  theme="dark"
  toastOptions={{
    style: 'background: var(--color-bg-surface); border: 1px solid var(--color-border); color: var(--color-text-primary); font-family: var(--font-sans);'
  }}
/>

<div class="h-screen flex bg-bg-base text-text-primary overflow-hidden" class:select-none={isResizing}>
  <!-- Sidebar -->
  <Sidebar
    folderPath={store.folderPath}
    isScanning={store.isScanning}
    genderFilter={store.genderFilter}
    categoryFilter={store.categoryFilter}
    availableCategories={store.availableCategories}
    totalCount={store.totalCount}
    filteredCount={store.filteredCount}
    selectedForExportCount={store.selectedForExportCount}
    onSelectFolder={() => store.selectAndScan()}
    onGenderChange={(v) => (store.genderFilter = v)}
    onCategoryChange={(v) => (store.categoryFilter = v)}
  />

  <!-- Main content area -->
  <div id="main-content" class="flex-1 flex flex-col min-w-0">
    {#if store.totalCount > 0}
      <Toolbar
        searchQuery={store.searchQuery}
        filteredCount={store.filteredCount}
        totalCount={store.totalCount}
        onSearchChange={(v) => (store.searchQuery = v)}
      />

      <div class="flex-1 flex min-h-0">
        <!-- Grid panel -->
        <div
          class="min-h-0 flex flex-col transition-[flex] duration-300 ease-out"
          style="flex: {viewer.isOpen ? (100 - viewerWidth) : 100}"
        >
          <ClothingGrid
            items={store.filteredItems}
            selectedItemId={viewer.selectedItem?.id}
            selectedForExport={store.selectedForExport}
            onSelect={(item) => viewer.selectItem(item)}
            onToggleExport={(item) => store.toggleExportSelection(item.id)}
          />
        </div>

        <!-- Viewer panel -->
        {#if viewer.isOpen}
          <div class="flex min-h-0" style="flex: {viewerWidth}">
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- Resize handle -->
            <div
              class="w-1 hover:w-1.5 bg-border hover:bg-primary/40 cursor-col-resize transition-all shrink-0 relative group"
              role="separator"
              aria-orientation="vertical"
              onmousedown={onResizeStart}
            >
              <div class="absolute inset-y-0 -left-1 -right-1"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-text-muted/0 group-hover:bg-primary/60 transition-colors"></div>
            </div>

            <div class="flex-1 min-w-0">
              <Viewer3D
                glbUrl={viewer.glbUrl}
                isConverting={viewer.isConverting}
                error={viewer.error}
                itemLabel={viewerLabel}
                textureCount={viewer.ytdPaths.length}
                activeTextureIndex={viewer.activeTextureIndex}
                loadTimeMs={viewer.loadTimeMs}
                onClose={() => viewer.closeViewer()}
                onTextureChange={(i) => viewer.selectTexture(i)}
              />
            </div>
          </div>
        {/if}
      </div>

      <!-- Export dock / Cart -->
      <ExportDock
        selectedCount={store.selectedForExportCount}
        selectedItems={store.selectedExportItems}
        isExporting={store.isExporting}
        onSelectAll={() => store.selectAllFiltered()}
        onClearSelection={() => store.clearExportSelection()}
        onRemoveItem={(id) => store.toggleExportSelection(id)}
        onExport={() => store.requestExport()}
        exportProgress={store.exportProgress}
      />

    {:else if store.isScanning}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-8 h-8 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="text-sm text-text-muted">Indexation en cours...</p>
        </div>
      </div>
    {:else}
      <EmptyState onSelectFolder={() => store.selectAndScan()} />
    {/if}
  </div>
</div>

{#if store.showExportPreview}
  <ExportPreview
    groups={exportPreviewGroups}
    offsets={store.categoryOffsets}
    onConfirm={() => store.confirmAndExport()}
    onCancel={() => store.cancelExportPreview()}
    onOffsetChange={(cat, val) => store.setCategoryOffset(cat, val)}
  />
{/if}

<DragGhost />
