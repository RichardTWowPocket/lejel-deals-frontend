import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Category } from '@/types/category'
import { ApiResponse } from '@/types/common'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // Request all active categories without pagination (limit=1000 should be enough)
        const response = await api.get<ApiResponse<{
          data: Category[]
          pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
          }
        }>>('/categories?limit=1000&isActive=true')
        
        // Response structure:
        // Backend service returns: { data: [...], pagination: {...} }
        // ApiResponse wrapper: { success: true, data: { data: [...], pagination: {...} }, ... }
        // So: response.data.data = { data: [...], pagination: {...} }
        // And: response.data.data.data = [...categories...]
        const wrappedData = response.data.data
        
        if (wrappedData && typeof wrappedData === 'object') {
          // Check if it's the paginated structure with nested 'data' property
          if ('data' in wrappedData && Array.isArray((wrappedData as any).data)) {
            return (wrappedData as any).data as Category[]
          }
          // Check if it's directly an array (fallback)
          if (Array.isArray(wrappedData)) {
            return wrappedData as Category[]
          }
        }
        
        // Fallback: return empty array
        console.warn('Categories API returned unexpected structure:', {
          responseData: response.data,
          wrappedData,
        })
        return []
      } catch (error) {
        console.error('Categories API error:', error)
        return []
      }
    },
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category>>(`/categories/${slug}`)
      return response.data.data
    },
    enabled: !!slug,
  })
}

export function useFeaturedCategories() {
  return useQuery({
    queryKey: ['categories', 'featured'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[]>>('/categories?featured=true')
      console.log('Featured categories API response:', response.data)
      
      const data = response.data.data
      
      // If data is an array, return it directly
      if (Array.isArray(data)) {
        return data
      }
      
      // If data is wrapped in an object, return it
      return data
    },
  })
}
