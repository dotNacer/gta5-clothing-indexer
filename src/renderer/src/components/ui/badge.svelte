<script lang="ts">
  import { cn } from '$lib/utils'
  import type { Snippet } from 'svelte'

  type Variant = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'male' | 'female' | 'muted'

  type Props = {
    variant?: Variant
    children: Snippet
    class?: string
  }

  let { variant = 'default', children, class: className }: Props = $props()

  const variantClasses: Record<Variant, string> = {
    default: 'bg-primary-muted text-primary',
    secondary: 'bg-secondary-muted text-secondary',
    success: 'bg-success-muted text-success',
    warning: 'bg-warning-muted text-warning',
    error: 'bg-error-muted text-error',
    male: 'bg-male-muted text-male',
    female: 'bg-female-muted text-female',
    muted: 'bg-bg-overlay text-text-secondary'
  }
</script>

<span
  class={cn(
    'inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[11px] font-semibold leading-none',
    variantClasses[variant],
    className
  )}
>
  {@render children()}
</span>
