import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ClothingItem } from '../shared/types'

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectFolder'),
  scanFolder: (folderPath: string): Promise<ClothingItem[]> =>
    ipcRenderer.invoke('indexer:scan', folderPath),
  convertClothing: (
    yddPath: string,
    ytdPath?: string
  ): Promise<{ glbUrl?: string; error?: string }> =>
    ipcRenderer.invoke('converter:convert', yddPath, ytdPath),
  selectOutputFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectOutputFolder'),
  writeThumbnail: (outputDir: string, fileName: string, dataUrl: string): Promise<void> =>
    ipcRenderer.invoke('thumbnails:write', outputDir, fileName, dataUrl)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
