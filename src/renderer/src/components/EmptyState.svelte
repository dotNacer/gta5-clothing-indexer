<script lang="ts">
  type Props = { onSelectFolder: () => void }
  let { onSelectFolder }: Props = $props()
</script>

<div class="empty">
  <div class="empty__glow" aria-hidden="true"></div>

  <div class="empty__icon">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <line x1="2" y1="8.5" x2="22" y2="8.5"/>
      <line x1="2" y1="15.5" x2="22" y2="15.5"/>
    </svg>
  </div>

  <h2 class="empty__title">GTA5 Clothing Indexer</h2>
  <p class="empty__sub">Select a GTA V mods folder to begin indexing</p>

  <button class="empty__btn" onclick={onSelectFolder}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
    Choose folder
  </button>

  <div class="empty__hints">
    <span class="hint">YDD + YTD files auto-detected</span>
    <span class="hint__sep">·</span>
    <span class="hint">3D preview included</span>
    <span class="hint__sep">·</span>
    <span class="hint">Export IDs</span>
  </div>
</div>

<style>
  .empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: relative;
    overflow: hidden;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .empty__glow {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 255, 200, 0.04) 0%,
      rgba(167, 139, 250, 0.03) 40%,
      transparent 70%
    );
    pointer-events: none;
  }

  .empty__icon {
    color: rgba(0, 255, 200, 0.25);
    filter: drop-shadow(0 0 16px rgba(0, 255, 200, 0.2));
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  .empty__title {
    font-size: 15px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    margin: 0;
  }

  .empty__sub {
    font-size: 12px;
    color: #374151;
    font-family: ui-monospace, monospace;
    margin: 0;
  }

  .empty__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 18px;
    background: rgba(0, 255, 200, 0.08);
    border: 1px solid rgba(0, 255, 200, 0.25);
    border-radius: 6px;
    color: #00ffc8;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .empty__btn:hover {
    background: rgba(0, 255, 200, 0.14);
    box-shadow: 0 0 16px rgba(0, 255, 200, 0.15);
  }

  .empty__hints {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .hint {
    font-size: 10px;
    font-family: ui-monospace, monospace;
    color: #2d3748;
    letter-spacing: 0.06em;
  }
  .hint__sep {
    color: #1f2937;
    font-size: 10px;
  }
</style>
