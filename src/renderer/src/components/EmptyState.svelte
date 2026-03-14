<script lang="ts">
  type Props = { onSelectFolder: () => void }
  let { onSelectFolder }: Props = $props()
</script>

<div class="flex-1 flex items-center justify-center">
  <div class="text-center max-w-sm">
    <div class="mx-auto w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
      <svg class="w-7 h-7 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    </div>
    <h2 class="text-lg font-semibold text-stone-300 mb-2">Aucun dossier sélectionné</h2>
    <p class="text-sm text-stone-500 mb-6 leading-relaxed">
      Sélectionnez un dossier contenant vos fichiers .ydd et .ytd pour commencer l'indexation.
    </p>
    <button
      onclick={onSelectFolder}
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-sm font-medium text-white transition-colors cursor-pointer"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      Choisir un dossier
    </button>
  </div>
</div>
