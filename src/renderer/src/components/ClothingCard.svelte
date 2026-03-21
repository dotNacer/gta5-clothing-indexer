<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'
  import { getThumbnailStore } from '../lib/thumbnails.svelte'
  import { getDragStore } from '$lib/dragDrop.svelte'
  import { hoverLift, clickPulse, dragLift, dragRelease } from '$lib/animations'
  import Badge from './ui/badge.svelte'

  type Props = {
    item: ClothingItem
    isSelected?: boolean
    isExportSelected?: boolean
    onSelect?: (item: ClothingItem) => void
    onToggleExport?: (item: ClothingItem) => void
  }
  let {
    item,
    isSelected = false,
    isExportSelected = false,
    onSelect,
    onToggleExport
  }: Props = $props()

  const thumbs = getThumbnailStore()
  const drag = getDragStore()
  const thumbnailUrl = $derived(thumbs.get(item.id))
  const isThumbnailLoading = $derived(thumbs.isLoading(item.id))
  const isBeingDragged = $derived(drag.isDragging && drag.dragItem?.id === item.id)

  const genderLabel = $derived(item.gender === 'male' ? 'M' : item.gender === 'female' ? 'F' : '?')
  const genderVariant = $derived<'male' | 'female' | 'muted'>(
    item.gender === 'male' ? 'male' : item.gender === 'female' ? 'female' : 'muted'
  )

  const statusVariant = $derived<'success' | 'warning'>(
    item.hasYdd && item.hasTextures ? 'success' : 'warning'
  )
  const statusLabel = $derived(
    item.hasYdd && item.hasTextures ? 'YDD + YTD' : item.hasYdd ? 'YDD' : 'YTD'
  )

  function handleCheckboxClick(e: MouseEvent): void {
    e.stopPropagation()
    onToggleExport?.(item)
  }

  function lazyLoad(node: HTMLElement): { destroy(): void } {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          thumbs.request(item)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return { destroy: () => observer.disconnect() }
  }

  // Drag initiation with 5px threshold
  let cardEl: HTMLElement
  let dragStartPos: { x: number; y: number } | null = null
  const DRAG_THRESHOLD = 5

  // React to drag state changes — auto-restore card visuals when drag ends
  $effect(() => {
    if (isBeingDragged && cardEl) {
      dragLift(cardEl)
    }
  })
  $effect(() => {
    if (!isBeingDragged && cardEl) {
      // Clean up any lingering GSAP transforms from dragLift
      dragRelease(cardEl)
    }
  })

  function onPointerDown(e: PointerEvent) {
    // Left mouse button only
    if (e.button !== 0) return
    // Don't start drag from checkbox
    if ((e.target as HTMLElement).closest('button')) return
    dragStartPos = { x: e.clientX, y: e.clientY }
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragStartPos || drag.isDragging) return
    const dx = e.clientX - dragStartPos.x
    const dy = e.clientY - dragStartPos.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist >= DRAG_THRESHOLD) {
      e.preventDefault()
      drag.startDrag(item, cardEl.getBoundingClientRect(), e.clientX, e.clientY)
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (e.button !== 0) return
    dragStartPos = null
  }

  /** Prevent native image/element drag */
  function onDragStart(e: DragEvent) {
    e.preventDefault()
  }
</script>

<div
  bind:this={cardEl}
  role="button"
  tabindex="0"
  onclick={() => { if (!drag.isDragging) onSelect?.(item) }}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.(item))}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  ondragstart={onDragStart}
  use:hoverLift
  use:clickPulse
  class="group rounded-[var(--radius-lg)] text-left w-full border transition-colors overflow-hidden relative cursor-pointer
    {isBeingDragged
      ? 'opacity-40 scale-95 bg-bg-elevated border-border'
      : isExportSelected
        ? 'bg-secondary-muted border-secondary/30'
        : isSelected
          ? 'bg-primary-muted border-primary/30'
          : 'bg-bg-elevated border-border hover:border-border-hover'}"
>
  <!-- Accent bar -->
  {#if isSelected || isExportSelected}
    <div class="absolute left-0 top-0 bottom-0 w-[3px] z-10 {isExportSelected ? 'bg-secondary' : 'bg-primary'}"></div>
  {/if}

  <!-- Thumbnail area -->
  <div
    use:lazyLoad
    class="aspect-square bg-bg-base flex items-center justify-center relative overflow-hidden"
  >
    {#if thumbnailUrl}
      <img
        src={thumbnailUrl}
        alt={item.categoryLabel}
        draggable="false"
        class="absolute inset-0 w-full h-full object-cover select-none"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
    {:else if isThumbnailLoading}
      <div class="absolute inset-0 animate-pulse bg-gradient-to-br from-bg-overlay/50 to-transparent"></div>
      <div class="text-center opacity-50">
        <span class="block text-xl font-bold text-text-muted uppercase tracking-wider">{item.category}</span>
        <span class="block text-3xl font-black text-text-muted/50 tabular-nums font-[family-name:var(--font-mono)]">
          {String(item.componentNum).padStart(3, '0')}
        </span>
      </div>
    {:else}
      <div class="text-center">
        <span class="block text-xl font-bold text-text-muted uppercase tracking-wider">{item.category}</span>
        <span class="block text-3xl font-black text-text-muted/50 tabular-nums font-[family-name:var(--font-mono)]">
          {String(item.componentNum).padStart(3, '0')}
        </span>
      </div>
    {/if}

    <!-- Export checkbox -->
    <button
      type="button"
      aria-label={isExportSelected ? "Désélectionner pour l'export" : "Sélectionner pour l'export"}
      aria-pressed={isExportSelected}
      onclick={handleCheckboxClick}
      class="absolute top-2 left-2 z-10 w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center transition-all cursor-pointer
        {isExportSelected
          ? 'bg-secondary border-secondary'
          : 'border-white/20 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100'}"
    >
      {#if isExportSelected}
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      {/if}
    </button>

    <!-- Gender badge -->
    <div class="absolute top-2 right-2">
      <Badge variant={genderVariant}>{genderLabel}</Badge>
    </div>

    <!-- Texture count -->
    {#if item.ytdCount > 0}
      <div class="absolute bottom-2 right-2">
        <span class="px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[10px] font-medium bg-black/40 text-white/80 backdrop-blur-sm font-[family-name:var(--font-mono)]">
          {item.ytdCount} tex
        </span>
      </div>
    {/if}
  </div>

  <!-- Card footer -->
  <div class="px-3 py-2.5 border-t border-border/50 space-y-1.5">
    <div class="flex items-center justify-between gap-2">
      <span class="text-[13px] font-semibold text-text-primary truncate">{item.categoryLabel}</span>
      <span class="text-[10px] font-[family-name:var(--font-mono)] text-text-muted shrink-0 tabular-nums">
        #{String(item.componentNum).padStart(3, '0')}
      </span>
    </div>
    <div class="flex items-center gap-1.5">
      <Badge variant={statusVariant}>{statusLabel}</Badge>
      <Badge variant="muted">{item.variant}</Badge>
    </div>
  </div>
</div>
