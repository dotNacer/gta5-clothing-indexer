import { basename } from 'path'
import type { ClothingItem, ParsedFile, ParsedYdd, ParsedYtd } from '../../shared/types'
import { CATEGORY_LABELS } from '../../shared/types'

interface PairingBucket {
  ydd: ParsedYdd | null
  ytds: ParsedYtd[]
}

export function buildIndex(parsedFiles: ParsedFile[]): ClothingItem[] {
  const buckets = new Map<string, PairingBucket>()

  for (const file of parsedFiles) {
    let bucket = buckets.get(file.pairingKey)
    if (!bucket) {
      bucket = { ydd: null, ytds: [] }
      buckets.set(file.pairingKey, bucket)
    }

    if (file.type === 'ydd') {
      bucket.ydd = file
    } else {
      bucket.ytds.push(file)
    }
  }

  const items: ClothingItem[] = []

  for (const [key, bucket] of buckets) {
    const ref = bucket.ydd ?? bucket.ytds[0]
    if (!ref) continue

    const fileName = bucket.ydd
      ? basename(bucket.ydd.filePath, '.ydd')
      : basename(bucket.ytds[0].filePath, '.ytd')

    items.push({
      id: key,
      fileName,
      gender: ref.gender,
      model: ref.model,
      category: ref.category,
      categoryLabel: CATEGORY_LABELS[ref.category] ?? ref.category,
      componentNum: ref.componentNum,
      variant: bucket.ydd?.variant ?? 'u',
      yddPath: bucket.ydd?.filePath ?? null,
      ytdPaths: bucket.ytds.map((t) => t.filePath).sort(),
      ytdCount: bucket.ytds.length,
      hasYdd: bucket.ydd !== null,
      hasTextures: bucket.ytds.length > 0
    })
  }

  items.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return a.componentNum - b.componentNum
  })

  return items
}
