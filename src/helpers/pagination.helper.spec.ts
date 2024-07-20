import { paginate } from './pagination.helper';

describe('Pagination Helper', () => {
  it('should return correct pagination for first page', () => {
    const data = [1, 2, 3, 4, 5];
    const total_data = 15;
    const page = 1;
    const limit = 5;

    const result = paginate(data, total_data, page, limit);

    expect(result).toEqual({
      list: data,
      pagination: {
        total_data: 15,
        per_page: 5,
        total_page: 3,
        current_page: 1,
        next_page: 2,
        prev_page: null,
      },
    });
  });

  it('should return correct pagination for middle page', () => {
    const data = [6, 7, 8, 9, 10];
    const total_data = 15;
    const page = 2;
    const limit = 5;

    const result = paginate(data, total_data, page, limit);

    expect(result).toEqual({
      list: data,
      pagination: {
        total_data: 15,
        per_page: 5,
        total_page: 3,
        current_page: 2,
        next_page: 3,
        prev_page: 1,
      },
    });
  });

  it('should return correct pagination for last page', () => {
    const data = [11, 12, 13, 14, 15];
    const total_data = 15;
    const page = 3;
    const limit = 5;

    const result = paginate(data, total_data, page, limit);

    expect(result).toEqual({
      list: data,
      pagination: {
        total_data: 15,
        per_page: 5,
        total_page: 3,
        current_page: 3,
        next_page: null,
        prev_page: 2,
      },
    });
  });

  it('should handle empty data', () => {
    const data: number[] = [];
    const total_data = 0;
    const page = 1;
    const limit = 5;

    const result = paginate(data, total_data, page, limit);

    expect(result).toEqual({
      list: [],
      pagination: {
        total_data: 0,
        per_page: 5,
        total_page: 0,
        current_page: 1,
        next_page: null,
        prev_page: null,
      },
    });
  });
});
