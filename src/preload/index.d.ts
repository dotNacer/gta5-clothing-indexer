import { ElectronAPI } from '@electron-toolkit/preload'
import type { ClothingItem, ExportResult } from '../shared/types'

interface ClothingIndexerAPI {
  selectFolder(): Promise<string | null>
  scanFolder(folderPath: string): Promise<ClothingItem[]>
  convertClothing(yddPath: string, ytdPath?: string): Promise<{ glbUrl?: string; error?: string }>
  releaseGlb(glbUrl: string): Promise<void>
  exportItems(items: ClothingItem[]): Promise<ExportResult | null>
  onExportProgress(callback: (data: { copied: number; total: number }) => void): () => void
  onUpdateAvailable(callback: (info: { version: string }) => void): () => void
  onDownloadProgress(callback: (progress: { percent: number }) => void): () => void
  onUpdateDownloaded(callback: () => void): () => void
  downloadUpdate(): Promise<void>
  installUpdate(): Promise<void>
  getAppVersion(): Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ClothingIndexerAPI
  }
}
