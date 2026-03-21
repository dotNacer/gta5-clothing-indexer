<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    text: string
    children: Snippet
    position?: 'top' | 'bottom' | 'left' | 'right'
  }

  let { text, children, position = 'top' }: Props = $props()

  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
</script>

<div class="relative group/tooltip inline-flex">
  {@render children()}
  <div
    class="absolute {positionClasses[position]} pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50"
  >
    <div
      class="whitespace-nowrap rounded-[var(--radius-sm)] bg-bg-overlay border border-border px-2 py-1 text-xs text-text-primary shadow-lg"
    >
      {text}
    </div>
  </div>
</div>
