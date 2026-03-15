import { execFile } from 'child_process'
import path from 'path'
import { app } from 'electron'
import { getGlbPath, isConverted } from './cache'

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
    const args = [yddPath]
    if (ytdPath) args.push(ytdPath)
    args.push(glbPath)

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

      resolve(glbPath)
    })
  })
}
