import { ElectronAPI } from '@electron-toolkit/preload'
import type { ClothingItem } from '../shared/types'

interface ClothingIndexerAPI {
  selectFolder(): Promise<string | null>
  scanFolder(folderPath: string): Promise<ClothingItem[]>
  convertClothing(
    yddPath: string,
    ytdPath?: string
  ): Promise<{ glbUrl?: string; error?: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ClothingIndexerAPI
  }
}
