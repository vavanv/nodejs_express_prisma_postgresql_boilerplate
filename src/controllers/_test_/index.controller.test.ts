import { getApiInfo } from '../index.controller';

describe('index.controller', () => {
  it('getApiInfo returns API info', () => {
    const result = getApiInfo();
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('version');
  });
}); 