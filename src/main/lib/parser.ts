import type { ScannedFile, ParsedFile, ParsedYdd, ParsedYtd } from '../../shared/types'

// mp_f_freemode_01^accs_010_u.ydd
const YDD_REGEX = /^mp_(f|m)_(\w+)\^([a-z_]+?)_(\d+)_([a-z])$/i

// mp_f_freemode_01^jbib_diff_001_a_uni.ytd
// mp_f_freemode_01^lowr_diff_023_a_whi.ytd
const YTD_REGEX = /^mp_(f|m)_(\w+)\^([a-z_]+?)_diff_(\d+)_([a-z])_(\w+)$/i

function resolveGender(code: string): 'male' | 'female' | 'unknown' {
  const lower = code.toLowerCase()
  if (lower === 'f') return 'female'
  if (lower === 'm') return 'male'
  return 'unknown'
}

function buildPairingKey(gender: string, model: string, category: string, num: number): string {
  return `${gender}_${model}_${category}_${String(num).padStart(3, '0')}`
}

function parseYdd(file: ScannedFile): ParsedYdd | null {
  const match = file.name.match(YDD_REGEX)
  if (!match) return null

  const gender = resolveGender(match[1])
  const model = match[2]
  const category = match[3].toLowerCase()
  const componentNum = parseInt(match[4], 10)
  const variant = match[5].toLowerCase()

  return {
    type: 'ydd',
    gender,
    model,
    category,
    componentNum,
    variant,
    filePath: file.path,
    pairingKey: buildPairingKey(match[1].toLowerCase(), model, category, componentNum)
  }
}

function parseYtd(file: ScannedFile): ParsedYtd | null {
  const match = file.name.match(YTD_REGEX)
  if (!match) return null

  const gender = resolveGender(match[1])
  const model = match[2]
  const category = match[3].toLowerCase()
  const componentNum = parseInt(match[4], 10)
  const textureLetter = match[5].toLowerCase()
  const suffix = match[6].toLowerCase()

  return {
    type: 'ytd',
    gender,
    model,
    category,
    componentNum,
    textureLetter,
    suffix,
    filePath: file.path,
    pairingKey: buildPairingKey(match[1].toLowerCase(), model, category, componentNum)
  }
}

function parseFallback(file: ScannedFile): ParsedFile {
  const categoryMatch = file.name.match(/(?:^|[\^_])([a-z_]+?)_(?:diff_)?(\d+)/i)

  const category = categoryMatch ? categoryMatch[1].toLowerCase() : 'unknown'
  const componentNum = categoryMatch ? parseInt(categoryMatch[2], 10) : 0

  const genderMatch = file.name.match(/mp_(f|m)/i)
  const gender = genderMatch ? resolveGender(genderMatch[1]) : 'unknown'

  const modelMatch = file.name.match(/mp_[fm]_(\w+)\^/i)
  const model = modelMatch ? modelMatch[1] : 'unknown'

  const key = buildPairingKey(
    genderMatch ? genderMatch[1].toLowerCase() : 'x',
    model,
    category,
    componentNum
  )

  if (file.ext === '.ydd') {
    const variantMatch = file.name.match(/_([a-z])$/i)
    return {
      type: 'ydd',
      gender,
      model,
      category,
      componentNum,
      variant: variantMatch ? variantMatch[1].toLowerCase() : 'u',
      filePath: file.path,
      pairingKey: key
    }
  }

  const letterMatch = file.name.match(/_(\d+)_([a-z])_/i)
  return {
    type: 'ytd',
    gender,
    model,
    category,
    componentNum,
    textureLetter: letterMatch ? letterMatch[2].toLowerCase() : '?',
    suffix: 'unknown',
    filePath: file.path,
    pairingKey: key
  }
}

export function parseFile(file: ScannedFile): ParsedFile {
  if (file.ext === '.ydd') {
    return parseYdd(file) ?? parseFallback(file)
  }
  return parseYtd(file) ?? parseFallback(file)
}

export function parseFiles(files: ScannedFile[]): ParsedFile[] {
  return files.map(parseFile)
}
