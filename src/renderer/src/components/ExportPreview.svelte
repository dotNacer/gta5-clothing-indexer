<script lang="ts">
  import type { ExportPreviewGroup } from '../../../shared/exportUtils'
  import { getThumbnailStore } from '../lib/thumbnails.svelte'
  import { staggerIn } from '$lib/animations'
  import Dialog from './ui/dialog.svelte'
  import Button from './ui/button.svelte'
  import Badge from './ui/badge.svelte'
  import Input from './ui/input.svelte'
  import Separator from './ui/separator.svelte'

  type Props = {
    groups: ExportPreviewGroup[]
    offsets: Record<string, number>
    onConfirm: () => void
    onCancel: () => void
    onOffsetChange: (category: string, offset: number) => void
  }
  let { groups, offsets, onConfirm, onCancel, onOffsetChange }: Props = $props()

  const thumbs = getThumbnailStore()

  const totalItems = $derived(groups.reduce((sum, g) => sum + g.items.length, 0))
  const totalFiles = $derived(
    groups.reduce(
      (sum, g) =>
        sum +
        g.items.reduce(
          (s, item) => s + (item.newYddName ? 1 : 0) + item.newYtdNames.length,
          0
        ),
      0
    )
  )

  // Expanded/collapsed state per category — derived to stay in sync
  let collapsedGroups = $state<Set<string>>(new Set())
  const expandedGroups = $derived(new Set(groups.filter((g) => !collapsedGroups.has(g.category)).map((g) => g.category)))

  function toggleGroup(category: string) {
    const next = new Set(collapsedGroups)
    if (next.has(category)) {
      next.delete(category)
    } else {
      next.add(category)
    }
    collapsedGroups = next
  }
</script>

<Dialog open={true} onClose={onCancel} class="max-w-4xl mx-4">
  <!-- Header -->
  <div class="px-6 py-5 border-b border-border shrink-0">
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-xl font-bold text-text-primary tracking-tight">Prévisualisation de l'export</h2>
        <div class="flex items-center gap-3 mt-2">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span class="text-sm text-text-secondary">
              <span class="font-semibold text-text-primary">{totalItems}</span> vêtement{totalItems > 1 ? 's' : ''}
            </span>
          </div>
          <div class="w-px h-4 bg-border"></div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span class="text-sm text-text-secondary">
              <span class="font-semibold text-text-primary">{totalFiles}</span> fichier{totalFiles > 1 ? 's' : ''}
            </span>
          </div>
          <div class="w-px h-4 bg-border"></div>
          <div class="flex items-center gap-1.5">
            <span class="text-sm text-text-secondary">
              <span class="font-semibold text-text-primary">{groups.length}</span> catégorie{groups.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onclick={onCancel}>
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>
    </div>
  </div>

  <!-- Content -->
  <div class="overflow-y-auto max-h-[calc(92vh-10rem)]">
    {#each groups as group, gi}
      <div>
        <!-- Category header -->
        <div class="sticky top-0 z-10 bg-bg-surface/95 backdrop-blur-sm border-b border-border/50">
          <div class="flex items-center gap-3 px-6 py-3">
            <button
              onclick={() => toggleGroup(group.category)}
              aria-label={expandedGroups.has(group.category) ? `Replier ${group.categoryLabel}` : `Déplier ${group.categoryLabel}`}
              class="p-0.5 rounded transition-colors hover:bg-bg-overlay cursor-pointer"
            >
              <svg
                class="w-4 h-4 text-text-muted transition-transform duration-200 {expandedGroups.has(group.category) ? 'rotate-90' : ''}"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div class="w-1 h-5 rounded-full bg-secondary/60 shrink-0"></div>

            <div class="flex items-center gap-2 min-w-0">
              <Badge variant="secondary">
                <span class="uppercase tracking-wider">{group.category}</span>
              </Badge>
              <span class="text-sm font-medium text-text-primary">{group.categoryLabel}</span>
              <span class="text-xs text-text-muted">
                {group.items.length} item{group.items.length > 1 ? 's' : ''}
              </span>
            </div>

            <div class="ml-auto flex items-center gap-2">
              <span class="text-[11px] text-text-muted font-medium">Offset ID</span>
              <div class="flex items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated overflow-hidden">
                <button
                  onclick={() => {
                    const cur = offsets[group.category] ?? 0
                    if (cur > 0) onOffsetChange(group.category, cur - 1)
                  }}
                  class="px-2 py-1 text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors cursor-pointer text-sm"
                >-</button>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={offsets[group.category] ?? 0}
                  oninput={(e) => {
                    const val = parseInt((e.target as HTMLInputElement).value) || 0
                    onOffsetChange(group.category, Math.max(0, Math.min(999, val)))
                  }}
                  class="w-12 h-7 text-center text-xs font-[family-name:var(--font-mono)] bg-transparent border-x border-border text-text-primary outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onclick={() => {
                    const cur = offsets[group.category] ?? 0
                    if (cur < 999) onOffsetChange(group.category, cur + 1)
                  }}
                  class="px-2 py-1 text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors cursor-pointer text-sm"
                >+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Items list -->
        {#if expandedGroups.has(group.category)}
          <div class="px-6 py-3 space-y-2" use:staggerIn={{ stagger: 0.03, y: 6 }}>
            {#each group.items as item, i}
              {@const thumbnailUrl = thumbs.get(item.id)}
              {@const newIndex = i + (offsets[group.category] ?? 0)}
              {@const genderVariant = item.gender === 'male' ? 'male' : item.gender === 'female' ? 'female' : 'muted'}
              {@const genderLabel = item.gender === 'male' ? 'M' : item.gender === 'female' ? 'F' : '?'}

              <div class="flex items-stretch gap-3 rounded-[var(--radius-lg)] bg-bg-elevated/60 border border-border/60 overflow-hidden hover:border-border-hover transition-colors group/item">
                <!-- Thumbnail -->
                <div class="w-16 h-16 shrink-0 bg-bg-base flex items-center justify-center relative overflow-hidden">
                  {#if thumbnailUrl}
                    <img
                      src={thumbnailUrl}
                      alt={item.categoryLabel}
                      class="absolute inset-0 w-full h-full object-cover"
                    />
                  {:else}
                    <div class="text-center">
                      <span class="block text-[10px] font-bold text-text-muted uppercase">{group.category}</span>
                      <span class="block text-sm font-black text-text-muted/40 tabular-nums font-[family-name:var(--font-mono)]">
                        {String(item.componentNum).padStart(3, '0')}
                      </span>
                    </div>
                  {/if}
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 py-2 pr-4">
                  <!-- Top row: name + badges -->
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[13px] font-semibold text-text-primary truncate">
                      {item.categoryLabel}
                    </span>
                    <span class="text-[11px] font-[family-name:var(--font-mono)] text-text-muted tabular-nums">
                      #{String(item.componentNum).padStart(3, '0')}
                    </span>
                    <Badge variant={genderVariant}>{genderLabel}</Badge>
                    <Badge variant="muted">{item.variant}</Badge>

                    {#if item.textureCount > 0}
                      <span class="text-[10px] text-text-muted ml-auto shrink-0">
                        {item.textureCount} tex
                      </span>
                    {/if}
                  </div>

                  <!-- File transformation -->
                  <div class="flex items-center gap-0 text-[11px] font-[family-name:var(--font-mono)]">
                    {#if item.newYddName}
                      <span class="text-text-muted/60 truncate">{item.originalFileName}.ydd</span>
                      <svg class="w-3.5 h-3.5 text-primary/60 shrink-0 mx-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span class="text-success font-medium truncate">{item.newYddName}</span>
                    {:else}
                      <span class="text-text-muted/40 italic">Pas de fichier .ydd</span>
                    {/if}
                  </div>
                </div>

                <!-- New ID indicator -->
                <div class="w-14 shrink-0 flex items-center justify-center bg-bg-overlay/30 border-l border-border/30">
                  <span class="text-lg font-bold font-[family-name:var(--font-mono)] tabular-nums text-primary/80">
                    {String(newIndex).padStart(3, '0')}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        {#if gi < groups.length - 1}
          <Separator />
        {/if}
      </div>
    {/each}
  </div>

  <!-- Footer -->
  <div class="px-6 py-4 border-t border-border flex items-center justify-between shrink-0 bg-bg-surface/50">
    <div class="text-xs text-text-muted">
      Les fichiers seront copiés et renommés dans un nouveau dossier.
    </div>
    <div class="flex items-center gap-3">
      <Button variant="ghost" onclick={onCancel}>Annuler</Button>
      <Button variant="secondary" onclick={onConfirm}>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Exporter {totalItems} item{totalItems > 1 ? 's' : ''}
      </Button>
    </div>
  </div>
</Dialog>
