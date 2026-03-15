<script lang="ts">
  import type { ExportResult } from '../../../shared/types'

  type Props = {
    result: ExportResult
    onDismiss: () => void
  }
  let { result, onDismiss }: Props = $props()

  const hasErrors = $derived(result.errors.length > 0)
</script>

<div class="fixed top-6 right-6 z-50 animate-toast-in max-w-sm">
  <div
    class="rounded-xl border p-4 backdrop-blur-xl shadow-2xl shadow-black/40 {hasErrors
      ? 'bg-amber-900/80 border-amber-500/30'
      : 'bg-emerald-900/80 border-emerald-500/30'}"
  >
    <div class="flex items-start gap-3">
      <div class="shrink-0 mt-0.5">
        {#if hasErrors}
          <svg
            class="w-5 h-5 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        {:else}
          <svg
            class="w-5 h-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        {/if}
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold {hasErrors ? 'text-amber-200' : 'text-emerald-200'}">
          {result.exportedFiles} fichier{result.exportedFiles > 1 ? 's' : ''} exporté{result.exportedFiles >
          1
            ? 's'
            : ''}
        </p>
        <p
          class="text-xs mt-1 truncate {hasErrors ? 'text-amber-300/70' : 'text-emerald-300/70'}"
          title={result.outputFolder}
        >
          {result.outputFolder}
        </p>
        {#if hasErrors}
          <p class="text-xs mt-1 text-amber-300/70">
            {result.errors.length} erreur{result.errors.length > 1 ? 's' : ''}
          </p>
        {/if}
      </div>

      <button
        onclick={onDismiss}
        class="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer {hasErrors
          ? 'text-amber-300/60'
          : 'text-emerald-300/60'}"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-toast-in {
    animation: toast-in 0.2s ease-out;
  }
</style>
