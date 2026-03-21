import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ClothingItem, ExportResult } from '../shared/types'

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectFolder'),
  scanFolder: (folderPath: string): Promise<ClothingItem[]> =>
    ipcRenderer.invoke('indexer:scan', folderPath),
  convertClothing: (
    yddPath: string,
    ytdPath?: string
  ): Promise<{ glbUrl?: string; error?: string }> =>
    ipcRenderer.invoke('converter:convert', yddPath, ytdPath),
  exportItems: (
    items: ClothingItem[],
    offsets?: Record<string, number>
  ): Promise<ExportResult | null> => ipcRenderer.invoke('export:execute', items, offsets),
  releaseGlb: (glbUrl: string): Promise<void> => ipcRenderer.invoke('glb:release', glbUrl),
  onExportProgress: (callback: (data: { copied: number; total: number }) => void): (() => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      data: { copied: number; total: number }
    ): void => callback(data)
    ipcRenderer.on('export:progress', handler)
    return () => ipcRenderer.removeListener('export:progress', handler)
  }
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
