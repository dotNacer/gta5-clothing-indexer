<script lang="ts">
  import Input from './ui/input.svelte'

  type Props = {
    searchQuery: string
    filteredCount: number
    totalCount: number
    onSearchChange: (value: string) => void
  }

  let { searchQuery, filteredCount, totalCount, onSearchChange }: Props = $props()
</script>

<div class="flex items-center gap-4 h-12 px-5 border-b border-border bg-bg-surface/50 shrink-0">
  <!-- Search -->
  <div class="relative flex-1 max-w-md">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
    <Input
      type="text"
      placeholder="Rechercher..."
      value={searchQuery}
      oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
      class="h-8 pl-9 pr-3 text-xs bg-bg-elevated/60"
    />
    {#if searchQuery}
      <button
        onclick={() => onSearchChange('')}
        aria-label="Effacer la recherche"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
      >
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>

  <!-- Count -->
  <div class="ml-auto flex items-center gap-2">
    <span class="text-xs text-text-muted">
      {#if filteredCount === totalCount}
        <span class="font-semibold text-text-secondary tabular-nums font-[family-name:var(--font-mono)]">{totalCount}</span> items
      {:else}
        <span class="font-semibold text-text-secondary tabular-nums font-[family-name:var(--font-mono)]">{filteredCount}</span>
        <span class="text-text-muted">/</span>
        <span class="tabular-nums font-[family-name:var(--font-mono)]">{totalCount}</span>
      {/if}
    </span>
  </div>
</div>
