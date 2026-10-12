import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const SIZE = 512

export async function renderTransparentThumbnail(url: string): Promise<string> {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(SIZE, SIZE, false)
  renderer.setPixelRatio(1)
  renderer.setClearColor(new Color(0x000000), 0)

  try {
    const scene = new Scene()
    const camera = new PerspectiveCamera(35, 1, 0.01, 100)
    scene.add(new AmbientLight(0xffffff, 1.2))
    const key = new DirectionalLight(0xffffff, 2.2)
    key.position.set(3, 5, 6)
    scene.add(key)
    const fill = new DirectionalLight(0xffffff, 0.8)
    fill.position.set(-4, 1, 3)
    scene.add(fill)

    const gltf = await new GLTFLoader().loadAsync(url)
    const model = gltf.scene
    const box = new Box3().setFromObject(model)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const largest = Math.max(size.x, size.y, size.z)
    if (!Number.isFinite(largest) || largest <= 0) throw new Error('Le modèle n’a pas de dimensions exploitables.')

    model.position.sub(center)
    model.rotation.x = -Math.PI / 2
    scene.add(model)

    const distance = largest / (2 * Math.tan((camera.fov * Math.PI) / 360))
    camera.position.set(0, 0, distance * 1.35)
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    return renderer.domElement.toDataURL('image/png')
  } finally {
    renderer.dispose()
    renderer.domElement.remove()
  }
}
