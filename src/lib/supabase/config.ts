export interface SupabaseConfigStatus {
  isConfigured: boolean
  url: string
  anonKey: string
  missing: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'>
}

export function getSupabaseConfigStatus(url = '', anonKey = ''): SupabaseConfigStatus {
  const trimmedUrl = url.trim()
  const trimmedAnonKey = anonKey.trim()
  const missing: SupabaseConfigStatus['missing'] = []

  if (!trimmedUrl) missing.push('VITE_SUPABASE_URL')
  if (!trimmedAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')

  return {
    isConfigured: missing.length === 0,
    url: trimmedUrl,
    anonKey: trimmedAnonKey,
    missing,
  }
}

export const supabaseConfigStatus = getSupabaseConfigStatus(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
