<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'

  type Props = {
    items: ClothingItem[]
    selectedItemId?: string | null
    isLoading?: boolean
    onSelect?: (item: ClothingItem) => void
  }
  let { items, selectedItemId = null, isLoading = false, onSelect }: Props = $props()

  const genderColor = (g: string) =>
    g === 'male' ? '#38bdf8' : g === 'female' ? '#f472b6' : '#6b7280'

  const statusDot = (item: ClothingItem) =>
    item.hasYdd && item.hasTextures ? '#22c55e' :
    item.hasYdd ? '#f59e0b' : '#ef4444'
</script>

{#if items.length === 0 && !isLoading}
  <div class="list__empty">
    <span>No results</span>
  </div>
{:else}
  <div class="list">
    {#each items as item (item.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="list__row {item.id === selectedItemId ? 'list__row--selected' : ''}"
        onclick={() => onSelect?.(item)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && onSelect?.(item)}
      >
        <!-- Status indicator -->
        <span class="list__dot" style="background:{statusDot(item)}"></span>

        <!-- Category code -->
        <span class="list__code">{item.category}</span>

        <!-- Component number -->
        <span class="list__num">#{String(item.componentNum).padStart(3, '0')}</span>

        <!-- Label -->
        <span class="list__label">{item.categoryLabel}</span>

        <!-- Gender badge -->
        <span class="list__gender" style="color:{genderColor(item.gender)}">
          {item.gender === 'male' ? 'M' : item.gender === 'female' ? 'F' : '?'}
        </span>

        <!-- Textures count -->
        {#if item.ytdCount > 0}
          <span class="list__ytd">{item.ytdCount}T</span>
        {:else}
          <span class="list__ytd list__ytd--empty">—</span>
        {/if}

        <!-- Variant -->
        <span class="list__variant">{item.variant}</span>

        <!-- Hover reveal arrow -->
        <span class="list__arrow">&rsaquo;</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .list__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-family: ui-monospace, monospace;
    color: #2d3748;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 200, 0.1) transparent;
  }
  .list::-webkit-scrollbar { width: 4px; }
  .list::-webkit-scrollbar-thumb { background: rgba(0, 255, 200, 0.1); border-radius: 2px; }

  .list__row {
    display: grid;
    grid-template-columns: 8px 38px 48px 1fr 18px 28px 44px 16px;
    align-items: center;
    gap: 10px;
    height: 36px;
    padding: 0 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255,255,255,0.02);
    transition: background 0.12s;
    position: relative;
    animation: rowIn 0.25s ease both;
  }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .list__row:hover {
    background: rgba(0, 255, 200, 0.03);
  }
  .list__row:hover .list__arrow { opacity: 1; }

  .list__row--selected {
    background: rgba(0, 255, 200, 0.05) !important;
  }
  .list__row--selected::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #00ffc8, #a78bfa);
    box-shadow: 0 0 8px rgba(0, 255, 200, 0.5);
  }

  .list__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 4px currentColor;
  }

  .list__code {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    font-weight: 700;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .list__num {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #374151;
    letter-spacing: 0.04em;
  }

  .list__label {
    font-size: 12px;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
  .list__row--selected .list__label { color: #e2e8f0; }

  .list__gender {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    font-weight: 700;
    text-align: center;
  }

  .list__ytd {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #a78bfa;
    text-align: right;
  }
  .list__ytd--empty { color: #2d3748; }

  .list__variant {
    font-size: 9px;
    font-family: ui-monospace, monospace;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list__arrow {
    font-size: 16px;
    color: #00ffc8;
    opacity: 0;
    transition: opacity 0.12s;
    text-align: center;
  }
</style>
