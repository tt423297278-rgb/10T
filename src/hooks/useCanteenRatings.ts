import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { canteenRatingService } from '../services/canteenRatingService'
import type { CanteenRatingScores } from '../types/domain'

export function useCanteenRatingSummaries(placeIds: string[]) {
  return useQuery({
    queryKey: ['canteen-rating-summaries', placeIds],
    queryFn: () => canteenRatingService.listSummaries(placeIds),
    enabled: canteenRatingService.isConfigured && placeIds.length > 0,
  })
}

export function useOwnCanteenRating(placeId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['canteen-own-rating', userId, placeId],
    queryFn: () => canteenRatingService.getOwnRating(placeId ?? ''),
    enabled: canteenRatingService.isConfigured && Boolean(userId && placeId),
  })
}

export function useSaveCanteenRating(placeId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ scores, reviewText, imageFiles }: { scores: CanteenRatingScores; reviewText: string; imageFiles: File[] }) => (
      canteenRatingService.saveRating(placeId ?? '', scores, reviewText, imageFiles)
    ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['canteen-rating-summaries'] }),
        queryClient.invalidateQueries({ queryKey: ['canteen-own-rating'] }),
      ])
    },
  })
}
