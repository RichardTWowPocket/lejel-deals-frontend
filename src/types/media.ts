/**
 * Media Types
 * 
 * Types for merchant media library management
 */

export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number // bytes
  url: string
  uploadedBy?: string | null
  createdAt: string
  // Usage tracking (if backend supports it)
  usage?: MediaUsage[]
}

export interface MediaUsage {
  type: 'DEAL' | 'MERCHANT'
  id: string
  title: string
}

export interface MediaListResponse {
  data: Media[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MediaFilters {
  page?: number
  limit?: number
  search?: string
  mimeType?: string
  sortBy?: 'createdAt' | 'size' | 'originalName'
  sortOrder?: 'asc' | 'desc'
}

export interface UploadProgress {
  file: File
  progress: number // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  mediaId?: string
}



