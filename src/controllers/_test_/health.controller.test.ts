import { getHealth } from '../health.controller';

describe('health.controller', () => {
  it('getHealth returns status OK and uptime', () => {
    const result = getHealth();
    expect(result).toHaveProperty('status', 'OK');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('uptime');
  });
}); 