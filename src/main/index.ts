import { app, shell, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron'
import { join } from 'path'
import path from 'path'
import { pathToFileURL } from 'url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { scanFolder } from './lib/scanner'
import { parseFiles } from './lib/parser'
import { buildIndex } from './lib/indexer'
import { convertToGlb } from './converter'
import { getCacheDir } from './cache'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'glb',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true
    }
  }
])

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  protocol.handle('glb', (request) => {
    const url = new URL(request.url)
    const fileName = decodeURIComponent(url.pathname.replace(/^\//, ''))
    const filePath = path.join(getCacheDir(), fileName)
    return net.fetch(pathToFileURL(filePath).href)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Choisir le dossier de vêtements'
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('indexer:scan', async (_event, folderPath: string) => {
    const scannedFiles = await scanFolder(folderPath)
    const parsedFiles = parseFiles(scannedFiles)
    return buildIndex(parsedFiles)
  })

  ipcMain.handle(
    'converter:convert',
    async (_event, yddPath: string, ytdPath?: string) => {
      try {
        const glbPath = await convertToGlb(yddPath, ytdPath)
        const glbFileName = path.basename(glbPath)
        const glbUrl = 'glb://model/' + encodeURIComponent(glbFileName)
        return { glbUrl }
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) }
      }
    }
  )

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
