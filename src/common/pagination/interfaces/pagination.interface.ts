export interface PaginatedResponse<T> {
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  data: T[];
}
