import { PaginatedResponse } from './interfaces/pagination.interface';

export class PaginationHelper {
  static build<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    pageSize: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      currentPage,
      pageSize,
      totalItems,
      data,
    };
  }
}
