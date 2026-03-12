/** Mirrors the backend API response envelope. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  httpCode: number;
  data: T;
}

/** Pagination metadata returned by list endpoints. */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/** Paginated list wrapper. */
export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Photo as returned by GET /photos (list view — includes comment count). */
export interface PhotoListItem {
  id: string;
  originalName: string;
  url: string;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
  };
}

/** Photo as returned by GET /photos/:id (detail view — includes comments). */
export interface PhotoDetail {
  id: string;
  originalName: string;
  url: string;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

/** Comment entity. */
export interface Comment {
  id: string;
  content: string;
  author: string;
  photoId: string;
  createdAt: string;
  updatedAt: string;
}
