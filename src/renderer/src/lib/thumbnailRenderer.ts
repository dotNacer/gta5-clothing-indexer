import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Box3,
  Vector3,
  Group,
  type Object3D,
  type Material
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const SIZE = 256

let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let loader: GLTFLoader | null = null
const LIGHT_COUNT = 4

function init(): void {
  if (renderer) return

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE

  renderer = new WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(SIZE, SIZE)
  renderer.setClearColor(0x1a1a22, 1)

  scene = new Scene()

  camera = new PerspectiveCamera(50, 1, 0.1, 100)
  camera.position.set(0, 0.6, 2.6)
  camera.lookAt(0, 0, 0)

  scene.add(new AmbientLight(0xffffff, 1.2))
  const d1 = new DirectionalLight(0xffffff, 1.3)
  d1.position.set(5, 5, 5)
  scene.add(d1)
  const d2 = new DirectionalLight(0xffffff, 0.6)
  d2.position.set(-3, 2, -3)
  scene.add(d2)
  const d3 = new DirectionalLight(0xffffff, 0.5)
  d3.position.set(0, -2, 4)
  scene.add(d3)

  loader = new GLTFLoader()
}

function disposeObject(obj: Object3D): void {
  obj.traverse((child: Object3D) => {
    const mesh = child as unknown as {
      geometry?: { dispose(): void }
      material?: Material | Material[]
    }
    mesh.geometry?.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => m.dispose())
    } else {
      mesh.material?.dispose()
    }
  })
}

export async function renderThumbnail(glbUrl: string): Promise<string> {
  init()

  while (scene!.children.length > LIGHT_COUNT) {
    const child = scene!.children[LIGHT_COUNT]
    scene!.remove(child)
    disposeObject(child)
  }

  const gltf = await loader!.loadAsync(glbUrl)
  const model = gltf.scene

  const box = new Box3().setFromObject(model)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = maxDim > 0 ? 2 / maxDim : 1

  model.position.set(-center.x, -center.y, -center.z)

  const group = new Group()
  group.scale.setScalar(scale)
  group.rotation.x = -Math.PI / 2
  group.add(model)

  scene!.add(group)
  renderer!.render(scene!, camera!)

  const dataUrl = renderer!.domElement.toDataURL('image/jpeg', 0.82)

  scene!.remove(group)
  disposeObject(group)

  return dataUrl
}
