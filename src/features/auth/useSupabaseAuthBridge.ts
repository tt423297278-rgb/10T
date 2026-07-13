import { useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useAppStore } from '../../app/store/useAppStore'

export function useSupabaseAuthBridge() {
  const setUserFromSupabase = useAppStore((state) => state.setUserFromSupabase)

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUserFromSupabase(data.session?.user ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSupabase(session?.user ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [setUserFromSupabase])
}
