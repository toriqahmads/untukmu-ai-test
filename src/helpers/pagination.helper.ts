import { IPagination } from 'src/interfaces/pagination.interface';

export function paginate<T>(
  data: T[],
  total_data: number,
  page: number,
  limit: number,
): IPagination<T> {
  const total_page = Math.ceil(total_data / limit);
  const pagination: IPagination<T> = {
    list: data,
    pagination: {
      total_data,
      per_page: limit,
      total_page,
      current_page: page,
      next_page: page < total_page ? page + 1 : null,
      prev_page: total_page > page && page > 1 ? page - 1 : null,
    },
  };

  return pagination;
}
