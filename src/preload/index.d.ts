import { ElectronAPI } from '@electron-toolkit/preload'
import type { ClothingItem, ExportResult } from '../shared/types'

interface ClothingIndexerAPI {
  selectFolder(): Promise<string | null>
  scanFolder(folderPath: string): Promise<ClothingItem[]>
  convertClothing(yddPath: string, ytdPath?: string): Promise<{ glbUrl?: string; error?: string }>
  exportItems(items: ClothingItem[]): Promise<ExportResult | null>
  onExportProgress(callback: (data: { copied: number; total: number }) => void): () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ClothingIndexerAPI
  }
}
