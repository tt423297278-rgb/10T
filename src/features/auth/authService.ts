import { supabase } from '../../lib/supabase/client'
import { supabaseConfigStatus } from '../../lib/supabase/config'

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends AuthCredentials {
  nickname: string
}

export const authService = {
  isConfigured: supabaseConfigStatus.isConfigured,
  missingConfig: supabaseConfigStatus.missing,

  async signIn({ email, password }: AuthCredentials) {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async signUp({ email, password, nickname }: RegisterCredentials) {
    if (!supabase) throw new Error('Supabase is not configured')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
      },
    })
    if (error) throw error
    return data
  },

  async resetPassword(email: string) {
    if (!supabase) throw new Error('Supabase is not configured')
    const redirectTo = `${import.meta.env.VITE_APP_URL ?? window.location.origin}/login`
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) throw error
    return data
  },

  async signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
