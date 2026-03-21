<script lang="ts">
  import { fadeIn } from '$lib/animations'
  import Button from './ui/button.svelte'

  type Props = { onSelectFolder: () => void }
  let { onSelectFolder }: Props = $props()
</script>

<div class="flex-1 flex items-center justify-center" use:fadeIn>
  <div class="text-center max-w-md px-8">
    <!-- Animated icon -->
    <div class="mx-auto w-20 h-20 rounded-[var(--radius-xl)] bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center mb-8 relative">
      <svg class="w-9 h-9 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
        <svg class="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    </div>

    <h2 class="text-xl font-bold text-text-primary mb-2 tracking-tight">
      Bienvenue dans GTA5 Clothing Indexer
    </h2>
    <p class="text-sm text-text-secondary mb-8 leading-relaxed">
      Sélectionnez un dossier contenant vos fichiers <span class="font-[family-name:var(--font-mono)] text-primary/80">.ydd</span> et <span class="font-[family-name:var(--font-mono)] text-primary/80">.ytd</span> pour commencer l'indexation et la prévisualisation 3D.
    </p>
    <Button onclick={onSelectFolder}>
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      Choisir un dossier
    </Button>
  </div>
</div>
