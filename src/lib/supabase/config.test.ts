import { describe, expect, it } from 'vitest'
import { getSupabaseConfigStatus } from './config'

describe('getSupabaseConfigStatus', () => {
  it('reports missing when url or anon key is empty', () => {
    expect(getSupabaseConfigStatus('', 'key').isConfigured).toBe(false)
    expect(getSupabaseConfigStatus('https://demo.supabase.co', '').isConfigured).toBe(false)
  })

  it('reports configured when url and anon key exist', () => {
    const status = getSupabaseConfigStatus('https://demo.supabase.co', 'anon-key')

    expect(status.isConfigured).toBe(true)
    expect(status.url).toBe('https://demo.supabase.co')
  })
})
