<script lang="ts">
  import { untrack } from 'svelte'
  import type { ClothingItem } from '../../../shared/types'
  import ClothingCard from './ClothingCard.svelte'

  type Props = {
    items: ClothingItem[]
    selectedItemId?: string | null
    selectedForExport?: Set<string>
    onSelect?: (item: ClothingItem) => void
    onToggleExport?: (item: ClothingItem) => void
  }
  let {
    items,
    selectedItemId = null,
    selectedForExport = new Set<string>(),
    onSelect,
    onToggleExport
  }: Props = $props()

  const PAD = 20
  const GAP = 16
  const MIN_COL = 200
  const CARD_FOOTER = 62
  const ROW_BUFFER = 4

  let containerEl: HTMLDivElement | undefined = $state()
  let cW = $state(0)
  let cH = $state(0)
  let scrollY = $state(0)
  let showScrollTop = $state(false)

  const availW = $derived(cW - 2 * PAD)
  const cols = $derived(Math.max(1, Math.floor((availW + GAP) / (MIN_COL + GAP))))
  const colW = $derived(availW > 0 ? (availW - (cols - 1) * GAP) / cols : MIN_COL)
  const rowH = $derived(colW + CARD_FOOTER)
  const step = $derived(rowH + GAP)
  const totalRows = $derived(Math.ceil(items.length / cols))
  const totalH = $derived(2 * PAD + totalRows * rowH + Math.max(0, totalRows - 1) * GAP)

  const visibleSlice = $derived.by(() => {
    if (cH <= 0 || step <= 0) return []
    const first = Math.max(0, Math.floor((scrollY - PAD) / step) - ROW_BUFFER)
    const last = Math.min(totalRows - 1, Math.ceil((scrollY + cH - PAD) / step) + ROW_BUFFER)

    const out: Array<{ item: ClothingItem; top: number; left: number }> = []
    for (let r = first; r <= last; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c
        if (idx >= items.length) break
        out.push({
          item: items[idx],
          top: PAD + r * step,
          left: PAD + c * (colW + GAP)
        })
      }
    }
    return out
  })

  function onScroll(e: Event): void {
    scrollY = (e.target as HTMLElement).scrollTop
    showScrollTop = scrollY > 500
  }

  function scrollToTop(): void {
    containerEl?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  $effect(() => {
    items
    untrack(() => {
      scrollY = 0
      showScrollTop = false
      if (containerEl) containerEl.scrollTop = 0
    })
  })
</script>

{#if items.length === 0}
  <div class="flex-1 flex items-center justify-center">
    <div class="text-center">
      <svg class="w-10 h-10 text-text-muted/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <p class="text-sm text-text-muted">Aucun résultat</p>
    </div>
  </div>
{:else}
  <div
    class="flex-1 overflow-y-auto relative"
    bind:this={containerEl}
    bind:clientWidth={cW}
    bind:clientHeight={cH}
    onscroll={onScroll}
  >
    <div style="height:{totalH}px;position:relative">
      {#each visibleSlice as v (v.item.id)}
        <div style="position:absolute;top:{v.top}px;left:{v.left}px;width:{colW}px">
          <ClothingCard
            item={v.item}
            isSelected={v.item.id === selectedItemId}
            isExportSelected={selectedForExport.has(v.item.id)}
            {onSelect}
            {onToggleExport}
          />
        </div>
      {/each}
    </div>

    <!-- Scroll to top button -->
    {#if showScrollTop}
      <button
        onclick={scrollToTop}
        class="fixed bottom-20 right-6 z-30 w-9 h-9 rounded-full bg-bg-surface border border-border hover:border-border-hover shadow-lg flex items-center justify-center text-text-muted hover:text-text-primary transition-all cursor-pointer"
        aria-label="Remonter en haut"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    {/if}
  </div>
{/if}
