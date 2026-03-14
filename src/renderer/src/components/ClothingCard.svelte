<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'

  type Props = { item: ClothingItem }
  let { item }: Props = $props()

  const genderLabel = $derived(
    item.gender === 'male' ? 'M' : item.gender === 'female' ? 'F' : '?'
  )

  const genderColor = $derived(
    item.gender === 'male'
      ? 'bg-sky-500/15 text-sky-400'
      : item.gender === 'female'
        ? 'bg-pink-500/15 text-pink-400'
        : 'bg-stone-500/15 text-stone-400'
  )

  const statusColor = $derived(
    item.hasYdd && item.hasTextures
      ? 'bg-emerald-500/15 text-emerald-400'
      : 'bg-amber-500/15 text-amber-400'
  )

  const statusLabel = $derived(
    item.hasYdd && item.hasTextures
      ? 'YDD + YTD'
      : item.hasYdd
        ? 'YDD seul'
        : 'YTD seul'
  )
</script>

<div class="group rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/20 hover:bg-white/[0.04] transition-all overflow-hidden">
  <div class="aspect-square bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center relative">
    <div class="text-center">
      <span class="block text-2xl font-bold text-stone-600 uppercase tracking-wider">{item.category}</span>
      <span class="block text-4xl font-black text-stone-500/60 tabular-nums">{String(item.componentNum).padStart(3, '0')}</span>
    </div>
    <div class="absolute top-2 right-2 flex gap-1">
      <span class="px-1.5 py-0.5 rounded text-[10px] font-bold {genderColor}">{genderLabel}</span>
    </div>
    {#if item.ytdCount > 0}
      <div class="absolute bottom-2 right-2">
        <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.06] text-stone-400">
          {item.ytdCount} texture{item.ytdCount > 1 ? 's' : ''}
        </span>
      </div>
    {/if}
  </div>

  <div class="px-3 py-2.5 border-t border-white/[0.04] space-y-1.5">
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm font-semibold text-stone-200 truncate">
        {item.categoryLabel}
      </span>
      <span class="text-[10px] font-mono text-stone-600 shrink-0">#{String(item.componentNum).padStart(3, '0')}</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="px-1.5 py-0.5 rounded text-[10px] font-medium {statusColor}">{statusLabel}</span>
      <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-stone-500 uppercase">{item.variant}</span>
    </div>
  </div>
</div>
