import type { ClothingItem } from './types'

export interface ExportPreviewItem {
  id: string
  originalFileName: string
  newYddName: string | null
  newYtdNames: string[]
  textureCount: number
  gender: 'male' | 'female' | 'unknown'
  componentNum: number
  variant: string
  categoryLabel: string
  hasYdd: boolean
  hasTextures: boolean
}

export interface ExportPreviewGroup {
  category: string
  categoryLabel: string
  items: ExportPreviewItem[]
}

function getBaseName(filePath: string): string {
  const sep = filePath.lastIndexOf('/') >= 0 ? '/' : '\\'
  const name = filePath.substring(filePath.lastIndexOf(sep) + 1)
  return name
}

function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex >= 0 ? fileName.substring(dotIndex) : ''
}

function stripExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex >= 0 ? fileName.substring(0, dotIndex) : fileName
}

function computeNewName(fileName: string, oldComponentNum: number, newComponentNum: number): string {
  const ext = getExtension(fileName)
  const base = stripExtension(fileName)

  const caretIndex = base.indexOf('^')
  const afterCaret = caretIndex >= 0 ? base.substring(caretIndex + 1) : base

  const oldNum = String(oldComponentNum).padStart(3, '0')
  const newNum = String(newComponentNum).padStart(3, '0')

  const renamed = afterCaret.replace(new RegExp(`_${oldNum}(?=_|$)`), `_${newNum}`)
  return renamed + ext
}

export function computeExportPreview(items: ClothingItem[], offsets?: Record<string, number>): ExportPreviewGroup[] {
  const grouped = new Map<string, ClothingItem[]>()
  for (const item of items) {
    const group = grouped.get(item.category) || []
    group.push(item)
    grouped.set(item.category, group)
  }

  const groups: ExportPreviewGroup[] = []

  for (const [category, groupItems] of grouped) {
    const sorted = [...groupItems].sort((a, b) => a.componentNum - b.componentNum)

    const offset = offsets?.[category] ?? 0
    const previewItems: ExportPreviewItem[] = sorted.map((item, i) => {
      const newNum = i + offset

      const newYddName = item.yddPath
        ? computeNewName(getBaseName(item.yddPath), item.componentNum, newNum)
        : null

      const newYtdNames = item.ytdPaths.map((ytdPath) =>
        computeNewName(getBaseName(ytdPath), item.componentNum, newNum)
      )

      return {
        id: item.id,
        originalFileName: item.fileName,
        newYddName,
        newYtdNames,
        textureCount: item.ytdCount,
        gender: item.gender,
        componentNum: item.componentNum,
        variant: item.variant,
        categoryLabel: item.categoryLabel,
        hasYdd: item.hasYdd,
        hasTextures: item.hasTextures
      }
    })

    groups.push({
      category,
      categoryLabel: sorted[0]?.categoryLabel ?? category,
      items: previewItems
    })
  }

  groups.sort((a, b) => a.category.localeCompare(b.category))
  return groups
}
