import type { ClothingItem } from '../../../shared/types'

let isDragging = $state(false)
let dragItem = $state<ClothingItem | null>(null)
let dragX = $state(0)
let dragY = $state(0)
let isOverDropZone = $state(false)
let dragOriginRect = $state<DOMRect | null>(null)

export function getDragStore() {
  return {
    get isDragging() {
      return isDragging
    },
    get dragItem() {
      return dragItem
    },
    get dragX() {
      return dragX
    },
    get dragY() {
      return dragY
    },
    get isOverDropZone() {
      return isOverDropZone
    },
    get dragOriginRect() {
      return dragOriginRect
    },

    startDrag(item: ClothingItem, originRect: DOMRect, x: number, y: number) {
      dragItem = item
      dragOriginRect = originRect
      dragX = x
      dragY = y
      isDragging = true
      isOverDropZone = false
    },

    updatePosition(x: number, y: number) {
      dragX = x
      dragY = y
    },

    setOverDropZone(over: boolean) {
      isOverDropZone = over
    },

    endDrag() {
      isDragging = false
      dragItem = null
      dragOriginRect = null
      isOverDropZone = false
    }
  }
}
