<script lang="ts">
  import CommandBar from './components/CommandBar.svelte'
  import ItemList from './components/ItemList.svelte'
  import EmptyState from './components/EmptyState.svelte'
  import Viewer3D from './components/Viewer3D.svelte'
  import { getStore } from './lib/stores.svelte'
  import { getViewerStore } from './lib/viewer.svelte'

  const store = getStore()
  const viewer = getViewerStore()

  const viewerLabel = $derived(
    viewer.selectedItem
      ? `${viewer.selectedItem.categoryLabel} #${String(viewer.selectedItem.componentNum).padStart(3, '0')}`
      : ''
  )
</script>

<div class="app-root">
  <CommandBar
    searchQuery={store.searchQuery}
    folderPath={store.folderPath}
    isScanning={store.isScanning}
    genderFilter={store.genderFilter}
    categoryFilter={store.categoryFilter}
    availableCategories={store.availableCategories}
    totalCount={store.totalCount}
    filteredCount={store.filteredCount}
    onSelectFolder={() => store.selectAndScan()}
    onSearchChange={(v) => (store.searchQuery = v)}
    onGenderChange={(v) => (store.genderFilter = v)}
    onCategoryChange={(v) => (store.categoryFilter = v)}
  />

  <div class="workspace">
    {#if store.totalCount > 0}
      <div class="panel-list" class:panel-list--shrunk={viewer.isOpen}>
        <ItemList
          items={store.filteredItems}
          selectedItemId={viewer.selectedItem?.id}
          isLoading={store.isScanning}
          onSelect={(item) => viewer.selectItem(item)}
        />
      </div>

      {#if viewer.isOpen}
        <div class="panel-viewer">
          <Viewer3D
            glbUrl={viewer.glbUrl}
            isConverting={viewer.isConverting}
            error={viewer.error}
            itemLabel={viewerLabel}
            onClose={() => viewer.closeViewer()}
          />
        </div>
      {/if}
    {:else if store.isScanning}
      <div class="scan-overlay">
        <div class="scan-spinner">
          <span class="scan-ring"></span>
          <span class="scan-ring scan-ring--delay"></span>
        </div>
        <p class="scan-label">Indexation en cours...</p>
      </div>
    {:else}
      <EmptyState onSelectFolder={() => store.selectAndScan()} />
    {/if}
  </div>
</div>

<style>
  .app-root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #080810;
    color: #e2e8f0;
    overflow: hidden;
    font-family: 'Inter', 'JetBrains Mono', ui-monospace, monospace;
  }

  .workspace {
    flex: 1;
    display: flex;
    min-height: 0;
    position: relative;
  }

  /* List panel — full width when viewer closed, 38% when open */
  .panel-list {
    width: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .panel-list--shrunk {
    width: 38%;
  }

  /* 3D viewer panel */
  .panel-viewer {
    flex: 1;
    min-height: 0;
    border-left: 1px solid rgba(0, 255, 200, 0.08);
    animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .scan-overlay {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .scan-spinner {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .scan-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #00ffc8;
    animation: spin 1s linear infinite;
  }
  .scan-ring--delay {
    inset: 6px;
    border-top-color: #a78bfa;
    animation-duration: 1.5s;
    animation-direction: reverse;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .scan-label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4a5568;
    font-family: ui-monospace, monospace;
  }
</style>
