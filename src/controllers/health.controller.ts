export function getHealth() {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
