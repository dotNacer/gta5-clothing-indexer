<script lang="ts">
  import { cn } from '$lib/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Variant = 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  type Size = 'default' | 'sm' | 'lg' | 'icon'

  type Props = HTMLButtonAttributes & {
    variant?: Variant
    size?: Size
    children: Snippet
    class?: string
  }

  let { variant = 'default', size = 'default', children, class: className, ...rest }: Props =
    $props()

  const variantClasses: Record<Variant, string> = {
    default: 'bg-primary text-bg-base hover:bg-primary-hover font-semibold',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover font-semibold',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay',
    outline:
      'border border-border text-text-secondary hover:text-text-primary hover:bg-bg-overlay hover:border-border-hover',
    destructive: 'bg-error text-white hover:brightness-110'
  }

  const sizeClasses: Record<Size, string> = {
    default: 'h-9 px-4 text-sm',
    sm: 'h-7 px-3 text-xs',
    lg: 'h-11 px-6 text-base',
    icon: 'h-9 w-9'
  }
</script>

<button
  class={cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    variantClasses[variant],
    sizeClasses[size],
    className
  )}
  {...rest}
>
  {@render children()}
</button>
