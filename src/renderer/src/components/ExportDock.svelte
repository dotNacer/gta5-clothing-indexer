<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'
  import { slideUp, cartItemPopIn, cartItemPopOut, dropZoneGlow } from '$lib/animations'
  import { getDragStore } from '$lib/dragDrop.svelte'
  import { getThumbnailStore } from '$lib/thumbnails.svelte'
  import Button from './ui/button.svelte'
  import Badge from './ui/badge.svelte'
  import Progress from './ui/progress.svelte'
  import gsap from 'gsap'

  type Props = {
    selectedCount: number
    selectedItems: ClothingItem[]
    isExporting: boolean
    onSelectAll: () => void
    onClearSelection: () => void
    onRemoveItem: (id: string) => void
    onExport: () => void
    exportProgress?: { copied: number; total: number } | null
  }

  let {
    selectedCount,
    selectedItems,
    isExporting,
    onSelectAll,
    onClearSelection,
    onRemoveItem,
    onExport,
    exportProgress = null
  }: Props = $props()

  const drag = getDragStore()
  const thumbs = getThumbnailStore()

  const isVisible = $derived(selectedCount > 0 || drag.isDragging)
  const MAX_VISIBLE_THUMBS = 30

  let dockEl = $state<HTMLElement>(null!)
  let glowTween: gsap.core.Tween | null = null

  // Drop zone glow effect
  $effect(() => {
    if (!dockEl) return
    if (drag.isDragging && drag.isOverDropZone) {
      glowTween?.kill()
      glowTween = dropZoneGlow(dockEl, true)
    } else {
      glowTween?.kill()
      glowTween = dropZoneGlow(dockEl, false)
    }
  })

  function handlePointerEnter() {
    if (drag.isDragging) {
      drag.setOverDropZone(true)
    }
  }

  function handlePointerLeave() {
    if (drag.isDragging) {
      drag.setOverDropZone(false)
    }
  }

  async function handleRemoveItem(id: string, el: HTMLElement) {
    await cartItemPopOut(el)
    onRemoveItem(id)
  }

  const progressPercent = $derived(
    exportProgress ? Math.round((exportProgress.copied / exportProgress.total) * 100) : 0
  )
</script>

{#if isVisible}
  <div
    bind:this={dockEl}
    id="export-dock-dropzone"
    class="shrink-0 border-t bg-bg-surface/80 backdrop-blur-sm transition-colors
      {drag.isDragging && drag.isOverDropZone ? 'border-secondary/50' : 'border-border'}"
    use:slideUp
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
  >
    <!-- Drop zone hint when dragging -->
    {#if drag.isDragging && selectedCount === 0}
      <div class="flex items-center justify-center gap-3 px-5 py-4">
        <div class="flex items-center gap-2 text-sm {drag.isOverDropZone ? 'text-secondary' : 'text-text-muted'}">
          <svg class="w-5 h-5 {drag.isOverDropZone ? 'text-secondary' : 'text-text-muted'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {#if drag.isOverDropZone}
            <span class="font-medium">Relâcher pour ajouter au panier</span>
          {:else}
            <span>Glisser ici pour ajouter au panier</span>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Main action bar -->
      <div class="flex items-center gap-4 px-5 py-3">
        <!-- Selection info -->
        <div class="flex items-center gap-2.5">
          <div class="relative">
            <svg class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <Badge variant="secondary" class="absolute -top-2 -right-3 scale-90">{selectedCount}</Badge>
          </div>
          <span class="text-sm text-text-secondary ml-2">
            item{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </span>
        </div>

        <!-- Drop hint while dragging over -->
        {#if drag.isDragging && drag.isOverDropZone}
          <div class="flex items-center gap-2 text-sm text-secondary font-medium animate-pulse">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Relâcher pour ajouter
          </div>
        {:else}
          <!-- Actions -->
          <div class="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onclick={onSelectAll}>
              Tout sélectionner
            </Button>
            <Button variant="ghost" size="sm" onclick={onClearSelection}>
              Effacer
            </Button>
          </div>
        {/if}

        <!-- Progress or Export button -->
        <div class="ml-auto flex items-center gap-3">
          {#if isExporting && exportProgress}
            <div class="flex items-center gap-3 min-w-[200px]">
              <Progress value={exportProgress.copied} max={exportProgress.total} class="flex-1" />
              <span class="text-xs font-[family-name:var(--font-mono)] tabular-nums text-text-secondary shrink-0">
                {exportProgress.copied}/{exportProgress.total}
              </span>
            </div>
          {:else if isExporting}
            <div class="flex items-center gap-2 text-sm text-text-secondary">
              <svg class="w-4 h-4 animate-spin text-secondary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Préparation...
            </div>
          {/if}

          <Button
            variant="secondary"
            onclick={onExport}
            disabled={isExporting || selectedCount === 0}
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Exporter
          </Button>
        </div>
      </div>

      <!-- Thumbnail strip -->
      {#if selectedItems.length > 0}
        <div class="border-t border-border/30 px-5 py-2.5">
          <div class="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
            {#each selectedItems.slice(0, MAX_VISIBLE_THUMBS) as cartItem (cartItem.id)}
              {@const cartThumb = thumbs.get(cartItem.id)}
              <div
                class="group/thumb relative shrink-0"
                use:cartItemPopIn
              >
                <div class="w-11 h-11 rounded-[var(--radius-md)] overflow-hidden border border-border/50 hover:border-secondary/50 transition-colors bg-bg-base relative">
                  {#if cartThumb}
                    <img
                      src={cartThumb}
                      alt={cartItem.categoryLabel}
                      class="w-full h-full object-cover"
                    />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="text-[8px] font-bold text-text-muted uppercase">{cartItem.category}</span>
                    </div>
                  {/if}

                  <!-- Remove button -->
                  <button
                    type="button"
                    aria-label="Retirer du panier"
                    class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"
                    onclick={(e) => {
                      e.stopPropagation()
                      const el = (e.currentTarget as HTMLElement).parentElement?.parentElement
                      if (el) handleRemoveItem(cartItem.id, el)
                    }}
                  >
                    <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            {/each}

            {#if selectedItems.length > MAX_VISIBLE_THUMBS}
              <div class="shrink-0 w-11 h-11 rounded-[var(--radius-md)] bg-bg-overlay border border-border/50 flex items-center justify-center">
                <span class="text-[10px] font-semibold text-text-muted">
                  +{selectedItems.length - MAX_VISIBLE_THUMBS}
                </span>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {/if}
  </div>
{/if}
