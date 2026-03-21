<script lang="ts">
  import { cn } from '$lib/utils'
  import type { HTMLInputAttributes } from 'svelte/elements'

  type Props = HTMLInputAttributes & {
    class?: string
  }

  let { class: className, ...rest }: Props = $props()
</script>

<input
  class={cn(
    'flex h-9 w-full rounded-[var(--radius-md)] bg-bg-elevated border border-border px-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors',
    'focus:border-primary/50 focus:bg-bg-overlay focus:ring-1 focus:ring-primary/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'font-[family-name:var(--font-sans)]',
    className
  )}
  {...rest}
/>
