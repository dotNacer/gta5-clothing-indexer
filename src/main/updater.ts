import { autoUpdater } from 'electron-updater'
import { BrowserWindow, app, ipcMain } from 'electron'
import { is } from '@electron-toolkit/utils'

export function initUpdater(mainWindow: BrowserWindow): void {
  if (is.dev) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('updater:update-available', { version: info.version })
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('updater:download-progress', { percent: progress.percent })
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('updater:update-downloaded')
  })

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err)
  })

  ipcMain.handle('updater:download', () => {
    return autoUpdater.downloadUpdate()
  })

  ipcMain.handle('updater:install', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.handle('updater:get-version', () => {
    return app.getVersion()
  })

  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('Update check failed:', err)
    })
  }, 3000)
}
