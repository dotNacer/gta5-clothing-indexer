<script lang="ts">
  import { cn } from '$lib/utils'
  import type { Snippet } from 'svelte'

  type Props = {
    open: boolean
    onClose: () => void
    children: Snippet
    class?: string
  }

  let { open, onClose, children, class: className }: Props = $props()

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
    onkeydown={handleKeydown}
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]"
      onclick={handleBackdropClick}
      role="presentation"
    ></div>

    <!-- Content -->
    <div
      class={cn(
        'relative z-10 w-full max-h-[92vh] overflow-y-auto rounded-[var(--radius-xl)] bg-bg-surface border border-border shadow-2xl shadow-black/50',
        'animate-[scale-in_0.2s_ease-out]',
        className
      )}
    >
      {@render children()}
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
