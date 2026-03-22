<!-- ClothingCard is no longer used in the redesign (replaced by ItemList rows),
     but kept for backwards compatibility in case it is imported elsewhere. -->
<script lang="ts">
  import type { ClothingItem } from '../../../shared/types'

  type Props = {
    item: ClothingItem
    isSelected?: boolean
    onSelect?: (item: ClothingItem) => void
  }
  let { item, isSelected = false, onSelect }: Props = $props()

  const genderLabel = $derived(
    item.gender === 'male' ? 'M' : item.gender === 'female' ? 'F' : '?'
  )
  const statusColor = $derived(
    item.hasYdd && item.hasTextures ? '#22c55e' : item.hasYdd ? '#f59e0b' : '#ef4444'
  )
</script>

<button
  onclick={() => onSelect?.(item)}
  class="card {isSelected ? 'card--selected' : ''}"
>
  <div class="card__preview">
    <span class="card__category">{item.category}</span>
    <span class="card__num">{String(item.componentNum).padStart(3, '0')}</span>
    <span class="card__status-dot" style="background:{statusColor}"></span>
  </div>
  <div class="card__footer">
    <span class="card__name">{item.categoryLabel}</span>
    <span class="card__gender">{genderLabel}</span>
  </div>
</button>

<style>
  .card {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    overflow: hidden;
    width: 100%;
  }
  .card:hover {
    border-color: rgba(0, 255, 200, 0.2);
    background: rgba(0, 255, 200, 0.03);
    box-shadow: 0 0 12px rgba(0, 255, 200, 0.06);
  }
  .card--selected {
    border-color: rgba(0, 255, 200, 0.35);
    background: rgba(0, 255, 200, 0.05);
    box-shadow: 0 0 0 1px rgba(0, 255, 200, 0.15), inset 0 0 20px rgba(0, 255, 200, 0.03);
  }
  .card__preview {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(0,255,200,0.03) 0%, transparent 100%);
  }
  .card__category {
    font-size: 11px;
    font-family: ui-monospace, monospace;
    font-weight: 700;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .card__num {
    font-size: 28px;
    font-family: ui-monospace, monospace;
    font-weight: 900;
    color: rgba(94, 107, 126, 0.5);
    line-height: 1;
  }
  .card__status-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    box-shadow: 0 0 4px currentColor;
  }
  .card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-top: 1px solid rgba(255,255,255,0.03);
  }
  .card__name {
    font-size: 11px;
    color: #64748b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card__gender {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    font-weight: 700;
    color: #374151;
  }
</style>
