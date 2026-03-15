<script lang="ts">
  type Props = {
    selectedCount: number
    isExporting: boolean
    onSelectAll: () => void
    onClearSelection: () => void
    onExport: () => void
  }
  let { selectedCount, isExporting, onSelectAll, onClearSelection, onExport }: Props = $props()
</script>

{#if selectedCount > 0}
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
    <div
      class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#18181b]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40"
    >
      <div class="flex items-center gap-2 pr-3 border-r border-white/[0.08]">
        <div class="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
          <span class="text-xs font-bold text-violet-400">{selectedCount}</span>
        </div>
        <span class="text-sm text-stone-300">
          vêtement{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
        </span>
      </div>

      <button
        onclick={onSelectAll}
        class="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        Tout sélectionner
      </button>

      <button
        onclick={onClearSelection}
        class="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-white/[0.06] transition-all cursor-pointer"
      >
        Désélectionner
      </button>

      <button
        onclick={onExport}
        disabled={isExporting}
        class="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors cursor-pointer"
      >
        {#if isExporting}
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Export en cours...
        {:else}
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Exporter
        {/if}
      </button>
    </div>
  </div>
{/if}

<style>
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  .animate-slide-up {
    animation: slide-up 0.25s ease-out;
  }
</style>
