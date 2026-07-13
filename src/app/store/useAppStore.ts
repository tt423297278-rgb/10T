import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AppUser {
  id: string
  nickname: string
  role: 'guest' | 'user' | 'admin'
}

interface AppState {
  user: AppUser | null
  isLoginModalOpen: boolean
  isMobileNavOpen: boolean
  toast: string | null
  signInAsDemoUser: () => void
  signInAsAdmin: () => void
  signOut: () => void
  setUserFromSupabase: (user: User | null) => void
  setLoginModalOpen: (open: boolean) => void
  setToast: (message: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoginModalOpen: false,
  isMobileNavOpen: false,
  toast: null,
  signInAsDemoUser: () =>
    set({ user: { id: 'demo-user', nickname: '麦田同行者', role: 'user' }, toast: '已进入原型登录态' }),
  signInAsAdmin: () =>
    set({ user: { id: 'demo-admin', nickname: '手册管理员', role: 'admin' }, toast: '已进入管理员原型态' }),
  signOut: () => set({ user: null, toast: '已退出原型登录态' }),
  setUserFromSupabase: (user) =>
    set({
      user: user
        ? {
            id: user.id,
            nickname:
              typeof user.user_metadata.nickname === 'string'
                ? user.user_metadata.nickname
                : user.email?.split('@')[0] ?? '麦田同行者',
            role: user.user_metadata.role === 'admin' ? 'admin' : 'user',
          }
        : null,
    }),
  setLoginModalOpen: (open) => set({ isLoginModalOpen: open }),
  setToast: (message) => set({ toast: message }),
}))
