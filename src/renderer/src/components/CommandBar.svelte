<script lang="ts">
  type CategoryOption = { code: string; label: string }

  type Props = {
    searchQuery: string
    folderPath: string | null
    isScanning: boolean
    genderFilter: 'all' | 'male' | 'female'
    categoryFilter: string
    availableCategories: CategoryOption[]
    totalCount: number
    filteredCount: number
    onSelectFolder: () => void
    onSearchChange: (value: string) => void
    onGenderChange: (value: 'all' | 'male' | 'female') => void
    onCategoryChange: (value: string) => void
  }

  let {
    searchQuery,
    folderPath,
    isScanning,
    genderFilter,
    categoryFilter,
    availableCategories,
    totalCount,
    filteredCount,
    onSelectFolder,
    onSearchChange,
    onGenderChange,
    onCategoryChange
  }: Props = $props()

  const genderOptions: { value: 'all' | 'male' | 'female'; label: string }[] = [
    { value: 'all', label: 'ALL' },
    { value: 'male', label: 'M' },
    { value: 'female', label: 'F' }
  ]
</script>

<div class="cmdbar">
  <!-- Logo mark -->
  <div class="cmdbar__logo" aria-label="GTA5 Clothing Indexer">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="8.5" x2="22" y2="8.5"/>
      <line x1="2" y1="15.5" x2="22" y2="15.5"/>
    </svg>
  </div>

  <!-- Search input -->
  <div class="cmdbar__search">
    <svg class="cmdbar__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      class="cmdbar__input"
      type="text"
      placeholder="Search clothing..."
      value={searchQuery}
      oninput={(e) => onSearchChange(e.currentTarget.value)}
      spellcheck={false}
    />
    {#if searchQuery}
      <span class="cmdbar__count">{filteredCount}/{totalCount}</span>
    {:else}
      <span class="cmdbar__hint">⌘K</span>
    {/if}
  </div>

  <!-- Gender filter pills -->
  {#if totalCount > 0}
    <div class="cmdbar__pills" role="group" aria-label="Gender filter">
      {#each genderOptions as opt}
        <button
          class="pill {genderFilter === opt.value ? 'pill--active' : ''}"
          onclick={() => onGenderChange(opt.value)}
        >
          {opt.label}
        </button>
      {/each}
    </div>

    <div class="cmdbar__sep"></div>

    <!-- Category chips -->
    <div class="cmdbar__chips" role="group" aria-label="Category filter">
      <button
        class="chip {categoryFilter === 'all' ? 'chip--active' : ''}"
        onclick={() => onCategoryChange('all')}
      >
        All
      </button>
      {#each availableCategories.slice(0, 8) as cat}
        <button
          class="chip {categoryFilter === cat.code ? 'chip--active' : ''}"
          onclick={() => onCategoryChange(cat.code)}
        >
          {cat.label}
        </button>
      {/each}
      {#if availableCategories.length > 8}
        <span class="chip chip--muted">+{availableCategories.length - 8}</span>
      {/if}
    </div>
  {/if}

  <div class="cmdbar__spacer"></div>

  <!-- Folder path badge -->
  {#if folderPath}
    <span class="cmdbar__path" title={folderPath}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
      {folderPath.split(/[\\/]/).slice(-2).join('/')}
    </span>
  {/if}

  <!-- Scan button -->
  <button class="cmdbar__scan {isScanning ? 'cmdbar__scan--busy' : ''}" onclick={onSelectFolder} disabled={isScanning}>
    {#if isScanning}
      <svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Scanning…
    {:else}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
      </svg>
      Scan folder
    {/if}
  </button>
</div>

<style>
  .cmdbar {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px;
    background: rgba(8, 8, 16, 0.95);
    border-bottom: 1px solid rgba(0, 255, 200, 0.06);
    backdrop-filter: blur(20px);
    position: relative;
    z-index: 10;
    flex-shrink: 0;
  }

  .cmdbar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      rgba(0, 255, 200, 0.015) 0%,
      transparent 40%,
      rgba(167, 139, 250, 0.015) 100%
    );
    pointer-events: none;
  }

  /* Logo */
  .cmdbar__logo {
    color: #00ffc8;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    filter: drop-shadow(0 0 6px rgba(0, 255, 200, 0.5));
  }

  /* Search */
  .cmdbar__search {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 260px;
    height: 30px;
    padding: 0 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 6px;
    flex-shrink: 0;
    transition: border-color 0.2s, background 0.2s;
  }
  .cmdbar__search:focus-within {
    border-color: rgba(0, 255, 200, 0.3);
    background: rgba(0, 255, 200, 0.03);
    box-shadow: 0 0 0 1px rgba(0, 255, 200, 0.1);
  }
  .cmdbar__search-icon { color: #4a5568; flex-shrink: 0; }
  .cmdbar__input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-size: 12px;
    color: #e2e8f0;
    font-family: inherit;
  }
  .cmdbar__input::placeholder { color: #374151; }
  .cmdbar__count {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #00ffc8;
    opacity: 0.7;
    flex-shrink: 0;
  }
  .cmdbar__hint {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #2d3748;
    flex-shrink: 0;
  }

  /* Gender pills */
  .cmdbar__pills {
    display: flex;
    gap: 2px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 6px;
    padding: 2px;
    flex-shrink: 0;
  }
  .pill {
    padding: 2px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    border-radius: 4px;
    border: none;
    background: none;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.15s;
    font-family: ui-monospace, monospace;
  }
  .pill:hover { color: #94a3b8; }
  .pill--active {
    background: rgba(0, 255, 200, 0.12);
    color: #00ffc8;
    box-shadow: 0 0 8px rgba(0, 255, 200, 0.15);
  }

  .cmdbar__sep {
    width: 1px;
    height: 20px;
    background: rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  /* Category chips */
  .cmdbar__chips {
    display: flex;
    gap: 4px;
    flex-wrap: nowrap;
    overflow: hidden;
    flex-shrink: 1;
    min-width: 0;
  }
  .chip {
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 500;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    color: #4a5568;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    font-family: ui-monospace, monospace;
  }
  .chip:hover { color: #94a3b8; border-color: rgba(255,255,255,0.12); }
  .chip--active {
    background: rgba(167, 139, 250, 0.12);
    border-color: rgba(167, 139, 250, 0.3);
    color: #a78bfa;
  }
  .chip--muted {
    background: none;
    border-color: transparent;
    color: #2d3748;
    cursor: default;
  }

  .cmdbar__spacer { flex: 1; }

  /* Path badge */
  .cmdbar__path {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #374151;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Scan button */
  .cmdbar__scan {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 14px;
    background: rgba(0, 255, 200, 0.08);
    border: 1px solid rgba(0, 255, 200, 0.2);
    border-radius: 6px;
    color: #00ffc8;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    font-family: inherit;
  }
  .cmdbar__scan:hover:not(:disabled) {
    background: rgba(0, 255, 200, 0.14);
    border-color: rgba(0, 255, 200, 0.4);
    box-shadow: 0 0 12px rgba(0, 255, 200, 0.15);
  }
  .cmdbar__scan--busy {
    color: #4a5568;
    border-color: rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
