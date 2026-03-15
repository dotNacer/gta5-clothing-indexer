<script lang="ts">
  import type { ExportPreviewGroup } from '../../../shared/exportUtils'

  type Props = {
    groups: ExportPreviewGroup[]
    onConfirm: () => void
    onCancel: () => void
  }
  let { groups, onConfirm, onCancel }: Props = $props()

  const totalItems = $derived(groups.reduce((sum, g) => sum + g.items.length, 0))
  const totalFiles = $derived(
    groups.reduce(
      (sum, g) =>
        sum +
        g.items.reduce(
          (s, item) => s + (item.newYddName ? 1 : 0) + item.newYtdNames.length,
          0
        ),
      0
    )
  )

  function handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) onCancel()
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') onCancel()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
  onclick={handleBackdropClick}
>
  <div
    class="bg-[#141416] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in"
  >
    <div class="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
      <div>
        <h2 class="text-lg font-semibold text-stone-100">Prévisualisation de l'export</h2>
        <p class="text-xs text-stone-500 mt-0.5">
          {totalItems} vêtement{totalItems > 1 ? 's' : ''} — {totalFiles} fichier{totalFiles > 1 ? 's' : ''}
        </p>
      </div>
      <button
        type="button"
        onclick={onCancel}
        aria-label="Fermer"
        class="p-1.5 rounded-lg hover:bg-white/[0.06] text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-5">
      {#each groups as group}
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-violet-400">{group.category}</span>
            <span class="text-xs text-stone-500">
              {group.categoryLabel} — {group.items.length} vêtement{group.items.length > 1 ? 's' : ''}
            </span>
          </div>
          <div class="space-y-1.5">
            {#each group.items as item, i}
              <div class="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span class="text-xs font-mono text-stone-600 mt-0.5 shrink-0 w-8 text-right">
                  {String(i).padStart(3, '0')}
                </span>
                <div class="flex-1 min-w-0 space-y-0.5">
                  {#if item.newYddName}
                    <div class="flex items-center gap-2 text-xs">
                      <span class="text-stone-500 truncate">{item.originalFileName}.ydd</span>
                      <svg class="w-3 h-3 text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span class="text-emerald-400 font-medium truncate">{item.newYddName}</span>
                    </div>
                  {/if}
                  {#if item.textureCount > 0}
                    <div class="text-[10px] text-stone-600">
                      + {item.textureCount} texture{item.textureCount > 1 ? 's' : ''}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <div class="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3 shrink-0">
      <button
        type="button"
        onclick={onCancel}
        class="px-4 py-2 rounded-lg text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        Annuler
      </button>
      <button
        type="button"
        onclick={onConfirm}
        class="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-sm font-semibold text-white transition-colors cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        Confirmer l'export
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fade-in 0.15s ease-out;
  }
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
</style>
