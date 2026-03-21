<script lang="ts">
  import { getDragStore } from '$lib/dragDrop.svelte'
  import { getThumbnailStore } from '$lib/thumbnails.svelte'
  import { getStore } from '$lib/stores.svelte'
  import { ghostAppear, flyToCart } from '$lib/animations'
  import gsap from 'gsap'
  import Badge from './ui/badge.svelte'

  const drag = getDragStore()
  const thumbs = getThumbnailStore()
  const store = getStore()

  let ghostEl = $state<HTMLElement | null>(null)
  let isDropAnimating = $state(false)

  // Smooth ghost follow via GSAP (disabled during fly-to-cart)
  $effect(() => {
    if (drag.isDragging && ghostEl && !isDropAnimating) {
      gsap.to(ghostEl, {
        x: drag.dragX - 60,
        y: drag.dragY - 70,
        duration: 0.08,
        ease: 'power1.out',
        overwrite: true
      })
    }
  })

  // Ghost appear animation on mount
  $effect(() => {
    if (drag.isDragging && ghostEl && !isDropAnimating) {
      ghostAppear(ghostEl)
    }
  })

  // Lock text selection while dragging
  $effect(() => {
    if (drag.isDragging) {
      document.body.style.userSelect = 'none'
      return () => {
        document.body.style.userSelect = ''
      }
    }
  })

  // Window-level pointer events for drag tracking
  $effect(() => {
    if (!drag.isDragging) return

    function onPointerMove(e: PointerEvent) {
      e.preventDefault()
      drag.updatePosition(e.clientX, e.clientY)
    }

    async function onPointerUp(e: PointerEvent) {
      if (e.button !== 0) return

      // Immediately remove listeners to prevent any further interference
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('contextmenu', onContextMenu)

      const wasOverDropZone = drag.isOverDropZone
      const draggedItem = drag.dragItem

      if (wasOverDropZone && draggedItem) {
        // Block the follow effect from overwriting flyToCart
        isDropAnimating = true

        const dockEl = document.getElementById('export-dock-dropzone')
        if (ghostEl && dockEl) {
          const targetRect = dockEl.getBoundingClientRect()
          await flyToCart(ghostEl, targetRect)
        }

        if (!store.selectedForExport.has(draggedItem.id)) {
          store.toggleExportSelection(draggedItem.id)
        }
      }

      isDropAnimating = false
      drag.endDrag()
    }

    function onContextMenu() {
      drag.endDrag()
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('contextmenu', onContextMenu)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('contextmenu', onContextMenu)
    }
  })

  const thumbnailUrl = $derived(drag.dragItem ? thumbs.get(drag.dragItem.id) : null)
  const genderVariant = $derived<'male' | 'female' | 'muted'>(
    drag.dragItem?.gender === 'male' ? 'male' : drag.dragItem?.gender === 'female' ? 'female' : 'muted'
  )
  const genderLabel = $derived(drag.dragItem?.gender === 'male' ? 'M' : drag.dragItem?.gender === 'female' ? 'F' : '?')
</script>

{#if drag.isDragging && drag.dragItem}
  <div
    bind:this={ghostEl}
    class="fixed top-0 left-0 z-[9999] pointer-events-none"
    style="will-change: transform, opacity;"
  >
    <div class="w-[120px] rounded-[var(--radius-lg)] overflow-hidden shadow-2xl border border-secondary/40 bg-bg-elevated rotate-[-3deg]">
      <!-- Mini thumbnail -->
      <div class="aspect-square bg-bg-base flex items-center justify-center relative overflow-hidden">
        {#if thumbnailUrl}
          <img
            src={thumbnailUrl}
            alt={drag.dragItem.categoryLabel}
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        {:else}
          <div class="text-center">
            <span class="block text-sm font-bold text-text-muted uppercase tracking-wider">{drag.dragItem.category}</span>
            <span class="block text-lg font-black text-text-muted/50 tabular-nums font-[family-name:var(--font-mono)]">
              {String(drag.dragItem.componentNum).padStart(3, '0')}
            </span>
          </div>
        {/if}

        <!-- Gender badge -->
        <div class="absolute top-1.5 right-1.5">
          <Badge variant={genderVariant}>{genderLabel}</Badge>
        </div>
      </div>

      <!-- Mini footer -->
      <div class="px-2 py-1.5 border-t border-border/50 bg-bg-elevated">
        <div class="flex items-center justify-between gap-1">
          <span class="text-[11px] font-semibold text-text-primary truncate">{drag.dragItem.categoryLabel}</span>
          <span class="text-[9px] font-[family-name:var(--font-mono)] text-text-muted shrink-0 tabular-nums">
            #{String(drag.dragItem.componentNum).padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  </div>
{/if}
