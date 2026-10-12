import assert from 'node:assert/strict'
import test from 'node:test'
import type { ClothingItem } from '../src/shared/types'
import { createThumbnailJobs } from '../src/shared/thumbnail-jobs'

const item = (overrides: Partial<ClothingItem> = {}): ClothingItem => ({
  id: 'male_freemode_01_jbib_007',
  fileName: 'mp_m_freemode_01^jbib_007_u',
  gender: 'male',
  model: 'freemode_01',
  category: 'jbib',
  categoryLabel: 'Hauts / Vestes',
  componentNum: 7,
  variant: 'u',
  yddPath: 'C:/pack/jbib_007.ydd',
  ytdPaths: ['C:/pack/jbib_diff_007_a_uni.ytd', 'C:/pack/jbib_diff_007_b_uni.ytd'],
  ytdCount: 2,
  hasYdd: true,
  hasTextures: true,
  ...overrides
})

test('creates one deterministic transparent PNG job per complete clothing item', () => {
  const jobs = createThumbnailJobs([item()])

  assert.deepEqual(jobs, [
    {
      id: 'male_freemode_01_jbib_007',
      yddPath: 'C:/pack/jbib_007.ydd',
      ytdPath: 'C:/pack/jbib_diff_007_a_uni.ytd',
      outputFileName: 'mp_m_freemode_01_jbib_007_u.png',
      category: 'jbib',
      gender: 'male'
    }
  ])
})

test('excludes assets that cannot produce a textured thumbnail', () => {
  const jobs = createThumbnailJobs([
    item({ yddPath: null, hasYdd: false }),
    item({ id: 'no-texture', ytdPaths: [], ytdCount: 0, hasTextures: false })
  ])

  assert.deepEqual(jobs, [])
})

test('makes output filenames safe when a source filename contains unexpected path characters', () => {
  const jobs = createThumbnailJobs([item({ fileName: '../unsafe/name' })])

  assert.equal(jobs[0].outputFileName, 'unsafe_name.png')
})
