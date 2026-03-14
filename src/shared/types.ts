export interface ClothingItem {
  id: string
  fileName: string
  gender: 'male' | 'female' | 'unknown'
  model: string
  category: string
  categoryLabel: string
  componentNum: number
  variant: string
  yddPath: string | null
  ytdPaths: string[]
  ytdCount: number
  hasYdd: boolean
  hasTextures: boolean
}

export interface ScannedFile {
  name: string
  path: string
  ext: '.ydd' | '.ytd'
}

export interface ParsedYdd {
  type: 'ydd'
  gender: 'male' | 'female' | 'unknown'
  model: string
  category: string
  componentNum: number
  variant: string
  filePath: string
  pairingKey: string
}

export interface ParsedYtd {
  type: 'ytd'
  gender: 'male' | 'female' | 'unknown'
  model: string
  category: string
  componentNum: number
  textureLetter: string
  suffix: string
  filePath: string
  pairingKey: string
}

export type ParsedFile = ParsedYdd | ParsedYtd

export const CATEGORY_LABELS: Record<string, string> = {
  accs: 'Accessoires',
  jbib: 'Hauts / Vestes',
  lowr: 'Pantalons / Bas',
  feet: 'Chaussures',
  teef: 'Chaines',
  head: 'Têtes',
  berd: 'Barbes',
  hair: 'Cheveux',
  uppr: 'Torso',
  hand: 'Mains / Gants',
  task: 'Gilets tactiques',
  decl: 'Décals / Overlays',
  p_head: 'Chapeaux',
  p_eyes: 'Lunettes',
  p_ears: "Boucles d'oreilles",
  p_lhand: 'Main gauche',
  p_rhand: 'Main droite'
}
