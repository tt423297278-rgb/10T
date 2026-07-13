import { describe, expect, it } from 'vitest'
import { validateUploadFile } from './uploadValidation'

describe('validateUploadFile', () => {
  it('accepts supported images under 10MB', () => {
    expect(validateUploadFile({ name: 'field.webp', type: 'image/webp', size: 1024 * 1024 })).toEqual({
      ok: true,
      mediaType: 'image',
    })
  })

  it('accepts supported videos under 50MB', () => {
    expect(validateUploadFile({ name: 'record.mp4', type: 'video/mp4', size: 20 * 1024 * 1024 })).toEqual({
      ok: true,
      mediaType: 'video',
    })
  })

  it('rejects unsupported mime types and oversized files', () => {
    expect(validateUploadFile({ name: 'bad.gif', type: 'image/gif', size: 1024 }).ok).toBe(false)
    expect(validateUploadFile({ name: 'huge.jpg', type: 'image/jpeg', size: 11 * 1024 * 1024 }).ok).toBe(false)
  })
})
