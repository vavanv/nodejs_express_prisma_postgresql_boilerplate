import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express Prisma API',
      version: '1.0.0',
      description:
        'API documentation for the Node.js Express Prisma PostgreSQL project',
    },
    servers: [{ url: '/api/v1', description: 'Version 1' }],
  },
  apis: ['./src/docs/*.yaml'], // Use YAML files per route
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
