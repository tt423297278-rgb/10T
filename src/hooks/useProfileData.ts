import { useQuery } from '@tanstack/react-query'
import { profileService, type ProfileFallbackUser } from '../services/profileService'

export function useProfileSnapshotQuery(user: ProfileFallbackUser | null) {
  return useQuery({
    queryKey: ['profile-snapshot', user?.id ?? 'guest'],
    queryFn: () => profileService.getSnapshot(user),
    enabled: Boolean(user),
  })
}
