import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/adminService'

type ModerationInput =
  | { type: 'post'; id: string; status: 'published' | 'hidden' | 'deleted' }
  | { type: 'comment'; id: string; status: 'published' | 'hidden' | 'deleted' }
  | { type: 'report'; id: string; status: 'resolved' | 'rejected' }

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
  })
}

export function useAdminModerationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ModerationInput) => {
      if (input.type === 'post') return adminService.updatePostStatus(input.id, input.status)
      if (input.type === 'comment') return adminService.updateCommentStatus(input.id, input.status)
      return adminService.updateReportStatus(input.id, input.status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}
