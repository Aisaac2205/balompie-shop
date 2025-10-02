// Health check endpoint para métricas de Railway
export const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  services: {
    frontend: 'operational',
    api: 'operational'
  }
};

// Endpoint para métricas de rendimiento
export const performanceMetrics = {
  timestamp: new Date().toISOString(),
  memory: {
    used: process.memoryUsage().heapUsed,
    total: process.memoryUsage().heapTotal,
    external: process.memoryUsage().external
  },
  cpu: {
    usage: process.cpuUsage()
  },
  uptime: process.uptime()
};
