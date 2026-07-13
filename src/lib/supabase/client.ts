import { createClient } from '@supabase/supabase-js'
import { supabaseConfigStatus } from './config'

export const supabase =
  supabaseConfigStatus.isConfigured
    ? createClient(supabaseConfigStatus.url, supabaseConfigStatus.anonKey)
    : null
