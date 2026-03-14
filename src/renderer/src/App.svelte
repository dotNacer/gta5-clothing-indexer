<script lang="ts">
  import Header from './components/Header.svelte'
  import FilterBar from './components/FilterBar.svelte'
  import ClothingGrid from './components/ClothingGrid.svelte'
  import EmptyState from './components/EmptyState.svelte'
  import { getStore } from './lib/stores.svelte'

  const store = getStore()
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
    <ClothingGrid items={store.filteredItems} />
  {:else if store.isScanning}
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <svg class="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p class="text-sm text-stone-500">Indexation en cours...</p>
      </div>
    </div>
  {:else}
    <EmptyState onSelectFolder={() => store.selectAndScan()} />
  {/if}
</div>
