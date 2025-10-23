export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination?: Pagination;
};

// Normalize any backend payload into a predictable paginated shape
export function formatPaginated<T = any>(raw: any): PaginatedResponse<T> {
  if (Array.isArray(raw)) {
    return { data: raw };
  }

  if (raw && Array.isArray(raw.data)) {
    return {
      data: raw.data as T[],
      pagination: raw.pagination as Pagination | undefined,
    };
  }

  return { data: [] };
}

// Normalize any backend payload into an array (fallback empty array)
export function formatArray<T = any>(raw: any): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && Array.isArray(raw.data)) return raw.data as T[];
  return [] as T[];
}

// Normalize orders.me response into { data, pagination }
export function formatOrdersWithPagination<T = any>(raw: any): PaginatedResponse<T> {
  // Unwrap axios response: raw.data
  const axiosData = raw?.data ?? raw;
  
  // Unwrap backend response interceptor: raw.data.data
  // Backend wraps in { success, data: {...}, timestamp, path }
  const backendData = axiosData?.data ?? axiosData;
  
  // Now check the actual structure
  // Case 1: Backend returns { orders: [...], pagination: {...} }
  if (backendData && Array.isArray(backendData.orders)) {
    return {
      data: backendData.orders as T[],
      pagination: backendData.pagination as Pagination | undefined,
    };
  }
  
  // Case 2: Backend returns { data: [...], pagination: {...} }
  if (backendData && Array.isArray(backendData.data)) {
    return {
      data: backendData.data as T[],
      pagination: backendData.pagination as Pagination | undefined,
    };
  }
  
  // Fallback to standard formatter
  return formatPaginated<T>(backendData);
}

// Normalize coupons.me response into { data, pagination }
export function formatCouponsWithPagination<T = any>(raw: any): PaginatedResponse<T> {
  // Unwrap axios response: raw.data
  const axiosData = raw?.data ?? raw;
  
  // Unwrap backend response interceptor: raw.data.data
  // Backend wraps in { success, data: {...}, timestamp, path }
  const backendData = axiosData?.data ?? axiosData;
  
  // Now check the actual structure
  // Case 1: Backend returns { coupons: [...], pagination: {...} }
  if (backendData && Array.isArray(backendData.coupons)) {
    return {
      data: backendData.coupons as T[],
      pagination: backendData.pagination as Pagination | undefined,
    };
  }
  
  // Case 2: Backend returns { data: [...], pagination: {...} }
  if (backendData && Array.isArray(backendData.data)) {
    return {
      data: backendData.data as T[],
      pagination: backendData.pagination as Pagination | undefined,
    };
  }
  
  // Fallback to standard formatter
  return formatPaginated<T>(backendData);
}