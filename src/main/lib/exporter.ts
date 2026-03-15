import { copyFile, mkdir } from 'fs/promises'
import { basename, extname, join } from 'path'
import type { ClothingItem, ExportResult } from '../../shared/types'

function computeNewFilename(
  originalPath: string,
  oldComponentNum: number,
  newComponentNum: number
): string {
  const ext = extname(originalPath)
  const base = basename(originalPath, ext)

  const caretIndex = base.indexOf('^')
  const afterCaret = caretIndex >= 0 ? base.substring(caretIndex + 1) : base

  const oldNum = String(oldComponentNum).padStart(3, '0')
  const newNum = String(newComponentNum).padStart(3, '0')

  const renamed = afterCaret.replace(new RegExp(`_${oldNum}(?=_|$)`), `_${newNum}`)
  return renamed + ext
}

export async function exportItems(
  items: ClothingItem[],
  outputFolder: string
): Promise<ExportResult> {
  const grouped = new Map<string, ClothingItem[]>()
  for (const item of items) {
    const group = grouped.get(item.category) || []
    group.push(item)
    grouped.set(item.category, group)
  }

  interface FileMapping {
    sourcePath: string
    destName: string
  }

  const mappings: FileMapping[] = []
  const errors: string[] = []

  for (const [, groupItems] of grouped) {
    groupItems.sort((a, b) => a.componentNum - b.componentNum)

    for (let i = 0; i < groupItems.length; i++) {
      const item = groupItems[i]
      const newNum = i

      if (item.yddPath) {
        mappings.push({
          sourcePath: item.yddPath,
          destName: computeNewFilename(item.yddPath, item.componentNum, newNum)
        })
      }

      for (const ytdPath of item.ytdPaths) {
        mappings.push({
          sourcePath: ytdPath,
          destName: computeNewFilename(ytdPath, item.componentNum, newNum)
        })
      }
    }
  }

  await mkdir(outputFolder, { recursive: true })

  let exportedFiles = 0
  for (const mapping of mappings) {
    try {
      await copyFile(mapping.sourcePath, join(outputFolder, mapping.destName))
      exportedFiles++
    } catch (err) {
      errors.push(
        `${basename(mapping.sourcePath)}: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  }

  return { exportedFiles, outputFolder, errors }
}
