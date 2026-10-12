import { ElectronAPI } from '@electron-toolkit/preload'
import type { ClothingItem } from '../shared/types'

interface ClothingIndexerAPI {
  selectFolder(): Promise<string | null>
  scanFolder(folderPath: string): Promise<ClothingItem[]>
  convertClothing(
    yddPath: string,
    ytdPath?: string
  ): Promise<{ glbUrl?: string; error?: string }>
  selectOutputFolder(): Promise<string | null>
  writeThumbnail(outputDir: string, fileName: string, dataUrl: string): Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ClothingIndexerAPI
  }
}
