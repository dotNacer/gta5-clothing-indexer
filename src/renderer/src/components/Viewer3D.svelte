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

<div class="viewer">
  <!-- Header bar -->
  <div class="viewer__bar">
    <div class="viewer__bar-left">
      <span class="viewer__dot"></span>
      <span class="viewer__label">{itemLabel}</span>
    </div>
    <div class="viewer__bar-right">
      <span class="viewer__hint">orbit · scroll zoom</span>
      <button class="viewer__close" onclick={onClose} aria-label="Close viewer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Viewport -->
  <div class="viewer__viewport">
    <!-- scanline texture overlay -->
    <div class="viewer__scanlines" aria-hidden="true"></div>

    <!-- Corner brackets -->
    <span class="corner corner--tl" aria-hidden="true"></span>
    <span class="corner corner--tr" aria-hidden="true"></span>
    <span class="corner corner--bl" aria-hidden="true"></span>
    <span class="corner corner--br" aria-hidden="true"></span>

    {#if isConverting}
      <div class="viewer__state">
        <div class="viewer__spinner"></div>
        <p class="viewer__state-text">Converting model…</p>
      </div>
    {:else if error}
      <div class="viewer__state">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="viewer__state-text viewer__state-text--error">Cannot load model</p>
        <p class="viewer__state-sub">{error}</p>
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
        <T.AmbientLight intensity={0.4} />
        <T.DirectionalLight intensity={1.2} position={[5, 5, 5]} />
        <T.DirectionalLight intensity={0.4} position={[-3, 2, -3]} color={0xa78bfa} />
        <T.PointLight intensity={0.6} position={[0, -2, 2]} color={0x00ffc8} />
        <ClothingModel url={glbUrl} />
      </Canvas>
    {:else}
      <div class="viewer__state">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d3748" stroke-width="1.5">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
        <p class="viewer__state-text">Select an item to preview</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .viewer {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #0a0a14;
    position: relative;
  }

  /* Top bar */
  .viewer__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding: 0 14px;
    border-bottom: 1px solid rgba(0, 255, 200, 0.06);
    background: rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
  }
  .viewer__bar-left, .viewer__bar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .viewer__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ffc8;
    box-shadow: 0 0 8px rgba(0, 255, 200, 0.7);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  .viewer__label {
    font-size: 11px;
    font-family: ui-monospace, monospace;
    color: #94a3b8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .viewer__hint {
    font-size: 9px;
    font-family: ui-monospace, monospace;
    color: #2d3748;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .viewer__close {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 4px;
    background: rgba(255,255,255,0.02);
    color: #4a5568;
    cursor: pointer;
    transition: all 0.15s;
  }
  .viewer__close:hover {
    color: #e2e8f0;
    border-color: rgba(248, 113, 113, 0.3);
    background: rgba(248, 113, 113, 0.08);
  }

  /* Viewport */
  .viewer__viewport {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  /* Scanline texture overlay */
  .viewer__scanlines {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.07) 2px,
      rgba(0, 0, 0, 0.07) 4px
    );
  }

  /* Corner bracket decorations */
  .corner {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: 3;
    pointer-events: none;
  }
  .corner--tl {
    top: 8px; left: 8px;
    border-top: 1px solid rgba(0, 255, 200, 0.3);
    border-left: 1px solid rgba(0, 255, 200, 0.3);
  }
  .corner--tr {
    top: 8px; right: 8px;
    border-top: 1px solid rgba(0, 255, 200, 0.3);
    border-right: 1px solid rgba(0, 255, 200, 0.3);
  }
  .corner--bl {
    bottom: 8px; left: 8px;
    border-bottom: 1px solid rgba(0, 255, 200, 0.3);
    border-left: 1px solid rgba(0, 255, 200, 0.3);
  }
  .corner--br {
    bottom: 8px; right: 8px;
    border-bottom: 1px solid rgba(0, 255, 200, 0.3);
    border-right: 1px solid rgba(0, 255, 200, 0.3);
  }

  /* States */
  .viewer__state {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 1;
  }
  .viewer__state-text {
    font-size: 12px;
    font-family: ui-monospace, monospace;
    color: #4a5568;
    letter-spacing: 0.06em;
  }
  .viewer__state-text--error { color: #f87171; }
  .viewer__state-sub {
    font-size: 10px;
    color: #374151;
    font-family: ui-monospace, monospace;
    max-width: 240px;
    text-align: center;
    word-break: break-all;
  }

  .viewer__spinner {
    width: 32px;
    height: 32px;
    border: 2px solid transparent;
    border-top-color: #00ffc8;
    border-right-color: rgba(0, 255, 200, 0.3);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
