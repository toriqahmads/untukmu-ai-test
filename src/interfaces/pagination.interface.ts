export interface IPagination<T> {
  list: T[];
  pagination: {
    total_data: number;
    per_page: number;
    total_page: number;
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
  };
}
