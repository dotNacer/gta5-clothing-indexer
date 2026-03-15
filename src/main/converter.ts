import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { getGlbPath, getCacheDir, isConverted } from './cache'

function getConverterPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin', 'YddConverter.exe')
  }
  return path.join(__dirname, '..', '..', 'resources', 'bin', 'YddConverter.exe')
}

export function convertToGlb(yddPath: string, ytdPath?: string): Promise<string> {
  const yddFileName = path.basename(yddPath)
  const glbPath = getGlbPath(yddFileName)

  if (isConverted(yddFileName)) {
    return Promise.resolve(glbPath)
  }

  return new Promise((resolve, reject) => {
    const args: string[] = [yddPath]
    if (ytdPath) {
      args.push(ytdPath, glbPath)
    }

    execFile(getConverterPath(), args, { timeout: 60_000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message))
        return
      }

      const output = stdout.trim()
      if (!output.startsWith('OK')) {
        reject(new Error(`Unexpected converter output: ${output}`))
        return
      }

      if (ytdPath) {
        resolve(glbPath)
      } else {
        const cliOutputPath = output.replace(/^OK\s+/, '')
        if (cliOutputPath !== glbPath) {
          fs.copyFileSync(cliOutputPath, glbPath)
          fs.unlinkSync(cliOutputPath)
        }
        resolve(glbPath)
      }
    })
  })
}
