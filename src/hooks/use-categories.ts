import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Category } from '@/types/category'
import { ApiResponse } from '@/types/common'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<Category[]>>('/categories')
        console.log('Categories API response:', response.data)
        
        const data = response.data.data
        console.log('Categories data:', data, 'Type:', typeof data, 'IsArray:', Array.isArray(data))
        
        // If data is an array, return it directly
        if (Array.isArray(data)) {
          console.log('Returning array with length:', data.length)
          return data
        }
        
        // If data is null/undefined, return empty array
        if (!data) {
          console.log('Data is null/undefined, returning empty array')
          return []
        }
        
        // If data is wrapped in an object, return it
        console.log('Returning wrapped data:', data)
        return data
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

