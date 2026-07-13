import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkInService } from '../services/checkInService'

export function useCheckInsQuery() {
  return useQuery({
    queryKey: ['check-ins'],
    queryFn: () => checkInService.listCheckIns(),
  })
}

export function usePointLedgerQuery() {
  return useQuery({
    queryKey: ['point-ledger'],
    queryFn: () => checkInService.listPointLedger(),
  })
}

export function usePerformCheckInMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => checkInService.performDailyCheckIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['check-ins'] })
      queryClient.invalidateQueries({ queryKey: ['point-ledger'] })
    },
  })
}
