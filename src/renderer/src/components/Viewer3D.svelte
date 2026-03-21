<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import ClothingModel from './ClothingModel.svelte'
  import Badge from './ui/badge.svelte'
  import Button from './ui/button.svelte'

  type Props = {
    glbUrl: string | null
    isConverting: boolean
    error: string | null
    itemLabel: string
    textureCount: number
    activeTextureIndex: number
    loadTimeMs: number | null
    onClose: () => void
    onTextureChange?: (index: number) => void
  }
  let {
    glbUrl,
    isConverting,
    error,
    itemLabel,
    textureCount,
    activeTextureIndex,
    loadTimeMs,
    onClose,
    onTextureChange
  }: Props = $props()

  const loadTimeVariant = $derived<'success' | 'warning' | 'error'>(
    loadTimeMs !== null ? (loadTimeMs < 2000 ? 'success' : loadTimeMs < 5000 ? 'warning' : 'error') : 'success'
  )
</script>

<div class="relative h-full w-full flex flex-col bg-bg-base">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-surface/50 shrink-0">
    <div class="flex items-center gap-2.5 min-w-0">
      <span class="text-sm font-semibold text-text-primary truncate">{itemLabel}</span>
      {#if loadTimeMs !== null}
        <Badge variant={loadTimeVariant}>
          <span class="font-[family-name:var(--font-mono)] tabular-nums">
            {loadTimeMs < 1000 ? `${loadTimeMs}ms` : `${(loadTimeMs / 1000).toFixed(1)}s`}
          </span>
        </Badge>
      {/if}
    </div>
    <Button variant="ghost" size="icon" onclick={onClose}>
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Button>
  </div>

  <!-- Canvas area -->
  <div class="flex-1 relative">
    <!-- Subtle radial gradient for studio feel -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-bg-elevated)_0%,_var(--color-bg-base)_70%)] pointer-events-none"></div>

    {#if isConverting}
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-center">
          <div class="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
          <p class="text-sm text-text-muted">Conversion en cours...</p>
        </div>
      </div>
    {:else if error}
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-center max-w-xs px-4">
          <div class="w-10 h-10 mx-auto mb-3 rounded-full bg-error-muted flex items-center justify-center">
            <svg class="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p class="text-sm text-error mb-1">Impossible de charger ce modele</p>
          <p class="text-xs text-text-muted break-all">{error}</p>
        </div>
      </div>
    {:else if glbUrl}
      <Canvas>
        <T.PerspectiveCamera makeDefault position={[0, 1, 3]} fov={50}>
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            minDistance={0.5}
            maxDistance={10}
          />
        </T.PerspectiveCamera>

        <T.AmbientLight intensity={1.2} />
        <T.DirectionalLight intensity={1.3} position={[5, 5, 5]} />
        <T.DirectionalLight intensity={0.6} position={[-3, 2, -3]} />
        <T.DirectionalLight intensity={0.5} position={[0, -2, 4]} />

        <ClothingModel url={glbUrl} />
      </Canvas>
    {:else}
      <div class="absolute inset-0 flex items-center justify-center">
        <p class="text-sm text-text-muted">Aucun modele chargé</p>
      </div>
    {/if}

    <!-- Texture selector -->
    {#if textureCount > 1}
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-bg-surface/80 backdrop-blur-md rounded-full px-3 py-2 border border-border shadow-lg">
        {#each { length: textureCount } as _, i}
          <button
            onclick={() => onTextureChange?.(i)}
            disabled={isConverting}
            class="w-7 h-7 rounded-full text-[11px] font-bold transition-all cursor-pointer
              {i === activeTextureIndex
                ? 'bg-primary text-bg-base shadow-md scale-110'
                : 'bg-bg-overlay text-text-secondary hover:bg-bg-overlay hover:text-text-primary'}
              disabled:opacity-40 disabled:pointer-events-none"
          >
            {String.fromCharCode(65 + i)}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
