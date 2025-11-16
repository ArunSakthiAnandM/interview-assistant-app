/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

/**
 * Message Response (for simple success/error messages)
 */
export interface MessageResponse {
  message: string;
}

/**
 * API Error Response
 */
export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
  // Additional helper fields
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/**
 * Sort Direction
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Sort Options
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * Pagination Options (for API requests)
 */
export interface PaginationOptions {
  page: number;
  size: number;
  sort?: string; // e.g., "createdAt,desc"
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  fileId: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * File Download Response
 */
export interface FileDownloadResponse {
  url: string;
  expiresAt: string;
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'UP' | 'DOWN';
  timestamp: string;
  service: string;
  version: string;
}

/**
 * Detailed Health Check Response
 */
export interface DetailedHealthCheckResponse extends HealthCheckResponse {
  components: {
    db: {
      status: 'UP' | 'DOWN';
    };
    diskSpace: {
      status: 'UP' | 'DOWN';
      details: {
        total: number;
        free: number;
        threshold: number;
      };
    };
  };
}

/**
 * Type Guard for API Error
 */
export function isApiError(response: any): response is ApiError {
  return response && !response.success && 'error' in response;
}

/**
 * Extract Pagination Metadata Helper
 */
export function extractPaginationMeta<T>(response: PaginatedResponse<T>): PaginationMeta {
  return {
    currentPage: response.number,
    pageSize: response.size,
    totalPages: response.totalPages,
    totalElements: response.totalElements,
    hasNext: !response.last,
    hasPrevious: !response.first,
    first: response.first,
    last: response.last,
    numberOfElements: response.numberOfElements,
    empty: response.empty,
  };
}
