<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import ClothingModel from './ClothingModel.svelte'

  type Props = {
    glbUrl: string | null
    isConverting: boolean
    error: string | null
    itemLabel: string
    onClose: () => void
  }
  let { glbUrl, isConverting, error, itemLabel, onClose }: Props = $props()
</script>

<div class="relative h-full w-full flex flex-col bg-[#12121a]">
  <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
    <span class="text-sm font-medium text-stone-300 truncate">{itemLabel}</span>
    <button
      onclick={onClose}
      aria-label="Fermer le viewer"
      class="p-1 rounded-md text-stone-500 hover:text-stone-200 hover:bg-white/[0.06] transition-colors"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div class="flex-1 relative">
    {#if isConverting}
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-center">
          <svg class="w-8 h-8 animate-spin text-orange-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="text-sm text-stone-400">Conversion en cours...</p>
        </div>
      </div>
    {:else if error}
      <div class="absolute inset-0 flex items-center justify-center z-10">
        <div class="text-center max-w-xs px-4">
          <svg class="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p class="text-sm text-red-400 mb-1">Impossible de charger ce modele</p>
          <p class="text-xs text-stone-600 break-all">{error}</p>
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

        <T.AmbientLight intensity={0.6} />
        <T.DirectionalLight intensity={0.8} position={[5, 5, 5]} />
        <T.DirectionalLight intensity={0.3} position={[-3, 2, -3]} />

        <ClothingModel url={glbUrl} />
      </Canvas>
    {:else}
      <div class="absolute inset-0 flex items-center justify-center">
        <p class="text-sm text-stone-600">Aucun modele charge</p>
      </div>
    {/if}
  </div>
</div>
