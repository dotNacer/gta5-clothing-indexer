<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'
  import ClothingCard from './ClothingCard.svelte'

  type Props = { items: ClothingItem[] }
  let { items }: Props = $props()
</script>

{#if items.length === 0}
  <div class="flex-1 flex items-center justify-center">
    <p class="text-sm text-stone-600">Aucun résultat</p>
  </div>
{:else}
  <div class="flex-1 overflow-y-auto p-6">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
      {#each items as item (item.id)}
        <ClothingCard {item} />
      {/each}
    </div>
  </div>
{/if}
