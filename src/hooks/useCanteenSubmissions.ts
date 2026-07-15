import { useMutation } from '@tanstack/react-query'
import { canteenSubmissionService } from '../services/canteenSubmissionService'
import type { CanteenSubmissionDraft } from '../features/canteen/canteenSubmissions'

export function useCreateCanteenSubmission() {
  return useMutation({
    mutationFn: (draft: CanteenSubmissionDraft) => canteenSubmissionService.create(draft),
  })
}
