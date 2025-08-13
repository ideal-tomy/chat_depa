import { useQuery } from '@tanstack/react-query'
import { profileAPI } from '@/lib/api-client'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileAPI.getProfile()
      if (!res.success) return { profile: null, auth: null }
      return res.data
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })
}


