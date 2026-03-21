<script lang="ts">
  import { fadeIn } from '$lib/animations'
  import Badge from './ui/badge.svelte'
  import Separator from './ui/separator.svelte'

  type CategoryOption = { code: string; label: string }

  type Props = {
    folderPath: string | null
    isScanning: boolean
    genderFilter: 'all' | 'male' | 'female'
    categoryFilter: string
    availableCategories: CategoryOption[]
    totalCount: number
    filteredCount: number
    selectedForExportCount: number
    onSelectFolder: () => void
    onGenderChange: (value: 'all' | 'male' | 'female') => void
    onCategoryChange: (value: string) => void
  }

  let {
    folderPath,
    isScanning,
    genderFilter,
    categoryFilter,
    availableCategories,
    totalCount,
    filteredCount,
    selectedForExportCount,
    onSelectFolder,
    onGenderChange,
    onCategoryChange
  }: Props = $props()

  let collapsed = $state(false)

  const genderOptions: { value: 'all' | 'male' | 'female'; label: string; icon: string }[] = [
    { value: 'all', label: 'Tous', icon: '👥' },
    { value: 'male', label: 'Homme', icon: '♂' },
    { value: 'female', label: 'Femme', icon: '♀' }
  ]

  const folderName = $derived(
    folderPath ? folderPath.split(/[\\/]/).filter(Boolean).pop() ?? folderPath : null
  )
</script>

<aside
  class="h-full flex flex-col bg-bg-surface border-r border-border transition-[width] duration-300 ease-out shrink-0 overflow-hidden"
  style="width: {collapsed ? '56' : '248'}px"
>
  <!-- Logo -->
  <div class="flex items-center gap-3 px-4 h-14 shrink-0">
    <div class="w-8 h-8 rounded-[var(--radius-md)] bg-gradient-to-br from-primary to-warning flex items-center justify-center shrink-0">
      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    </div>
    {#if !collapsed}
      <div class="min-w-0">
        <h1 class="text-sm font-bold tracking-tight text-text-primary truncate">GTA5 Clothing</h1>
        <p class="text-[10px] text-text-muted font-medium tracking-wide uppercase">Indexer</p>
      </div>
    {/if}
  </div>

  <Separator />

  <!-- Folder -->
  <div class="px-3 py-3 shrink-0">
    <button
      onclick={onSelectFolder}
      disabled={isScanning}
      class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-md)] bg-bg-elevated hover:bg-bg-overlay border border-border hover:border-border-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div class="w-7 h-7 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center shrink-0">
        {#if isScanning}
          <svg class="w-3.5 h-3.5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        {:else}
          <svg class="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        {/if}
      </div>
      {#if !collapsed}
        <div class="min-w-0 text-left">
          {#if isScanning}
            <p class="text-xs font-medium text-text-secondary">Scan en cours...</p>
          {:else if folderName}
            <p class="text-xs font-medium text-text-primary truncate">{folderName}</p>
            <p class="text-[10px] text-text-muted truncate" title={folderPath}>{folderPath}</p>
          {:else}
            <p class="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              Choisir un dossier
            </p>
          {/if}
        </div>
      {/if}
    </button>
  </div>

  {#if totalCount > 0 && !collapsed}
    <Separator />

    <!-- Gender filter -->
    <div class="px-3 py-3 shrink-0" use:fadeIn={{ delay: 0.05 }}>
      <p class="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2 px-1">Genre</p>
      <div class="space-y-0.5">
        {#each genderOptions as opt}
          <button
            onclick={() => onGenderChange(opt.value)}
            class="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left transition-all cursor-pointer {genderFilter === opt.value
              ? 'bg-primary-muted text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'}"
          >
            <span class="text-xs w-4 text-center">{opt.icon}</span>
            <span class="text-xs font-medium flex-1">{opt.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <Separator />

    <!-- Category filter -->
    <div class="flex-1 min-h-0 flex flex-col px-3 py-3" use:fadeIn={{ delay: 0.1 }}>
      <p class="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2 px-1">Categories</p>
      <div class="flex-1 overflow-y-auto space-y-0.5 -mx-1 px-1">
        <button
          onclick={() => onCategoryChange('all')}
          class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left transition-all cursor-pointer {categoryFilter === 'all'
            ? 'bg-primary-muted text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'}"
        >
          <span class="text-xs font-medium flex-1">Toutes</span>
          <Badge variant={categoryFilter === 'all' ? 'default' : 'muted'}>
            {totalCount}
          </Badge>
        </button>
        {#each availableCategories as cat}
          <button
            onclick={() => onCategoryChange(cat.code)}
            class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left transition-all cursor-pointer {categoryFilter === cat.code
              ? 'bg-primary-muted text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'}"
          >
            <span class="text-xs font-medium flex-1 truncate">{cat.label}</span>
          </button>
        {/each}
      </div>
    </div>
  {:else if !collapsed}
    <div class="flex-1"></div>
  {/if}

  <!-- Bottom stats & collapse -->
  <div class="shrink-0">
    <Separator />
    <div class="px-3 py-3">
      {#if !collapsed && totalCount > 0}
        <div class="space-y-1 mb-3 px-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-text-muted">Affichés</span>
            <span class="text-[10px] font-semibold text-text-secondary tabular-nums font-[family-name:var(--font-mono)]">{filteredCount} / {totalCount}</span>
          </div>
          {#if selectedForExportCount > 0}
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-text-muted">Sélectionnés</span>
              <Badge variant="secondary">{selectedForExportCount}</Badge>
            </div>
          {/if}
        </div>
      {/if}
      <button
        onclick={() => (collapsed = !collapsed)}
        class="w-full flex items-center justify-center p-1.5 rounded-[var(--radius-sm)] text-text-muted hover:text-text-secondary hover:bg-bg-overlay transition-all cursor-pointer"
        aria-label={collapsed ? 'Déplier la sidebar' : 'Replier la sidebar'}
      >
        <svg
          class="w-4 h-4 transition-transform duration-300 {collapsed ? 'rotate-180' : ''}"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    </div>
  </div>
</aside>
