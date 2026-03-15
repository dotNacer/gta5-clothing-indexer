<script lang="ts">
  import { T } from '@threlte/core'
  import { GLTF } from '@threlte/extras'
  import { Box3, Vector3, type Group } from 'three'

  type Props = {
    url: string
  }
  let { url }: Props = $props()

  let modelScale = $state(1)
  let modelOffset = $state<[number, number, number]>([0, 0, 0])

  function handleLoad(event: { scene: Group }): void {
    const box = new Box3().setFromObject(event.scene)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 2
    modelScale = maxDim > 0 ? targetSize / maxDim : 1
    modelOffset = [-center.x, -center.y, -center.z]
  }
</script>

{#key url}
  <T.Group scale={[modelScale, modelScale, modelScale]}>
    <GLTF
      {url}
      position={modelOffset}
      onload={handleLoad}
    />
  </T.Group>
{/key}
