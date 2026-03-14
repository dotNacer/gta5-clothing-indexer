<script lang="ts">
  type Props = {
    searchQuery: string
    folderPath: string | null
    isScanning: boolean
    onSelectFolder: () => void
    onSearchChange: (value: string) => void
  }

  let { searchQuery, folderPath, isScanning, onSelectFolder, onSearchChange }: Props = $props()
</script>

<header class="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-[#0c0c0e]/80 backdrop-blur-xl">
  <div class="flex items-center gap-3 shrink-0">
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    </div>
    <h1 class="text-base font-semibold tracking-tight text-stone-100">GTA5 Clothing Indexer</h1>
  </div>

  <div class="flex-1 max-w-md relative">
    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
    <input
      type="text"
      placeholder="Rechercher un vêtement..."
      value={searchQuery}
      oninput={(e) => onSearchChange(e.currentTarget.value)}
      class="w-full h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-stone-200 placeholder:text-stone-600 outline-none focus:border-orange-500/40 focus:bg-white/[0.06] transition-all"
    />
  </div>

  <div class="flex items-center gap-3 ml-auto">
    {#if folderPath}
      <span class="text-xs text-stone-500 max-w-[200px] truncate" title={folderPath}>
        {folderPath}
      </span>
    {/if}
    <button
      onclick={onSelectFolder}
      disabled={isScanning}
      class="flex items-center gap-2 h-9 px-4 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white transition-colors cursor-pointer"
    >
      {#if isScanning}
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Scan en cours...
      {:else}
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        Choisir un dossier
      {/if}
    </button>
  </div>
</header>
