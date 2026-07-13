import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import type { ReactNode } from 'react'
import { useSupabaseAuthBridge } from '../../features/auth/useSupabaseAuthBridge'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  useSupabaseAuthBridge()

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HelmetProvider>
  )
}
