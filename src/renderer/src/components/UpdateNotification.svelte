<script lang="ts">
  import { toast } from 'svelte-sonner'

  type UpdateStatus = 'idle' | 'available' | 'downloading' | 'ready'

  let status = $state<UpdateStatus>('idle')
  let updateVersion = $state('')
  let downloadPercent = $state(0)

  $effect(() => {
    const unsubs: (() => void)[] = []

    unsubs.push(
      window.api.onUpdateAvailable((info) => {
        updateVersion = info.version
        status = 'available'
        toast.info(`Mise à jour v${info.version} disponible`, {
          duration: Infinity,
          action: {
            label: 'Télécharger',
            onClick: () => {
              status = 'downloading'
              window.api.downloadUpdate()
            }
          }
        })
      })
    )

    unsubs.push(
      window.api.onDownloadProgress((progress) => {
        downloadPercent = Math.round(progress.percent)
      })
    )

    unsubs.push(
      window.api.onUpdateDownloaded(() => {
        status = 'ready'
        toast.success('Mise à jour prête !', {
          duration: Infinity,
          action: {
            label: 'Redémarrer',
            onClick: () => window.api.installUpdate()
          }
        })
      })
    )

    return () => unsubs.forEach((fn) => fn())
  })
</script>

{#if status === 'downloading'}
  <div class="fixed bottom-4 right-4 z-50 bg-bg-surface border border-border rounded-lg px-4 py-3 shadow-lg min-w-[240px]">
    <p class="text-xs text-text-muted mb-2">Téléchargement v{updateVersion}...</p>
    <div class="relative h-2 w-full overflow-hidden rounded-full bg-bg-overlay">
      <div
        class="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
        style="width: {downloadPercent}%"
      ></div>
    </div>
    <p class="text-xs text-text-muted mt-1 text-right">{downloadPercent}%</p>
  </div>
{/if}
