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
  },
  onUpdateAvailable: (callback: (info: { version: string }) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, info: { version: string }): void =>
      callback(info)
    ipcRenderer.on('updater:update-available', handler)
    return () => ipcRenderer.removeListener('updater:update-available', handler)
  },
  onDownloadProgress: (callback: (progress: { percent: number }) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, progress: { percent: number }): void =>
      callback(progress)
    ipcRenderer.on('updater:download-progress', handler)
    return () => ipcRenderer.removeListener('updater:download-progress', handler)
  },
  onUpdateDownloaded: (callback: () => void): (() => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('updater:update-downloaded', handler)
    return () => ipcRenderer.removeListener('updater:update-downloaded', handler)
  },
  downloadUpdate: (): Promise<void> => ipcRenderer.invoke('updater:download'),
  installUpdate: (): Promise<void> => ipcRenderer.invoke('updater:install'),
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('updater:get-version')
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
