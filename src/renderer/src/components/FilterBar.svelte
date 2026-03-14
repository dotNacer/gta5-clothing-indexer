<script lang="ts">
  type CategoryOption = { code: string; label: string }

  type Props = {
    genderFilter: 'all' | 'male' | 'female'
    categoryFilter: string
    availableCategories: CategoryOption[]
    totalCount: number
    filteredCount: number
    onGenderChange: (value: 'all' | 'male' | 'female') => void
    onCategoryChange: (value: string) => void
  }

  let {
    genderFilter,
    categoryFilter,
    availableCategories,
    totalCount,
    filteredCount,
    onGenderChange,
    onCategoryChange
  }: Props = $props()

  const genderOptions: { value: 'all' | 'male' | 'female'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' }
  ]
</script>

<div class="flex items-center gap-4 px-6 py-3 border-b border-white/[0.04] bg-[#0c0c0e]/40">
  <div class="flex items-center gap-1.5 p-0.5 rounded-lg bg-white/[0.03]">
    {#each genderOptions as opt}
      <button
        onclick={() => onGenderChange(opt.value)}
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer {genderFilter === opt.value
          ? 'bg-orange-500/15 text-orange-400 shadow-sm'
          : 'text-stone-400 hover:text-stone-300 hover:bg-white/[0.04]'}"
      >
        {opt.label}
      </button>
    {/each}
  </div>

  <div class="w-px h-5 bg-white/[0.06]"></div>

  <div class="flex items-center gap-1.5 flex-wrap">
    <button
      onclick={() => onCategoryChange('all')}
      class="px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer {categoryFilter === 'all'
        ? 'bg-orange-500/15 text-orange-400'
        : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.04]'}"
    >
      Toutes
    </button>
    {#each availableCategories as cat}
      <button
        onclick={() => onCategoryChange(cat.code)}
        class="px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer {categoryFilter === cat.code
          ? 'bg-orange-500/15 text-orange-400'
          : 'text-stone-500 hover:text-stone-300 hover:bg-white/[0.04]'}"
      >
        {cat.label}
      </button>
    {/each}
  </div>

  <div class="ml-auto shrink-0">
    <span class="text-xs text-stone-500">
      {#if filteredCount === totalCount}
        <span class="text-stone-300 font-semibold">{totalCount}</span> vêtements
      {:else}
        <span class="text-stone-300 font-semibold">{filteredCount}</span> sur {totalCount}
      {/if}
    </span>
  </div>
</div>
