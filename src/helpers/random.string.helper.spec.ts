import { randomString } from './random.string.helper';

describe('Random String Helper', () => {
  it('should generate a string of default length 10', () => {
    const result = randomString();
    expect(result).toHaveLength(10);
    expect(result).toMatch(/^[A-Z0-9]+$/);
  });

  it('should generate a string of specified length', () => {
    const length = 15;
    const result = randomString(length);
    expect(result).toHaveLength(length);
    expect(result).toMatch(/^[A-Z0-9]+$/);
  });

  it('should generate different strings on multiple calls', () => {
    const result1 = randomString();
    const result2 = randomString();
    expect(result1).not.toEqual(result2);
  });

  it('should handle length of 0', () => {
    const result = randomString(0);
    expect(result).toHaveLength(0);
  });

  it('should handle large lengths', () => {
    const length = 1000;
    const result = randomString(length);
    expect(result).toHaveLength(length);
    expect(result).toMatch(/^[A-Z0-9]+$/);
  });
});
