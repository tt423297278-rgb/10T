import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { communityService, type CreateCommentInput, type CreatePostInput, type ReportInput } from '../services/communityService'

export function useCommunityPostsQuery() {
  return useQuery({
    queryKey: ['community-posts'],
    queryFn: () => communityService.listPosts(),
  })
}

export function usePostCommentsQuery(postId: string | undefined) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => communityService.listComments(postId ?? ''),
    enabled: Boolean(postId),
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePostInput) => communityService.createPost(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
  })
}

export function useCreateCommentMutation(postId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCommentInput) => communityService.createComment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}

export function useToggleLikeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => communityService.toggleLike(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
  })
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => communityService.toggleFavorite(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => communityService.deletePost(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts'] }),
  })
}

export function useReportTargetMutation() {
  return useMutation({
    mutationFn: (input: ReportInput) => communityService.reportTarget(input),
  })
}
