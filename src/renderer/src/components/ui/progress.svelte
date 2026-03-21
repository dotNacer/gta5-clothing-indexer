<script lang="ts">
  import { cn } from '$lib/utils'

  type Props = {
    value: number
    max?: number
    class?: string
  }

  let { value, max = 100, class: className }: Props = $props()

  const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)))
</script>

<div
  class={cn(
    'relative h-2 w-full overflow-hidden rounded-full bg-bg-overlay',
    className
  )}
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
>
  <div
    class="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
    style="width: {percentage}%"
  ></div>
</div>
