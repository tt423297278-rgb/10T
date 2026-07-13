import { useQuery } from '@tanstack/react-query'
import { publicDataService } from '../services/publicDataService'

export function useMembersQuery() {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => publicDataService.listMembers(),
  })
}

export function useEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => publicDataService.listEvents(),
  })
}

export function useOfficialUpdatesQuery() {
  return useQuery({
    queryKey: ['official-updates'],
    queryFn: () => publicDataService.listOfficialUpdates(),
  })
}
