import Fastify from 'fastify';
import orderRoutes from './routes/orderRoutes.js';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default async function buildApp() {
  const app = Fastify({ logger: true });

  // โหลด Swagger เฉพาะตอนที่ไม่ใช่ test
  if (process.env.NODE_ENV !== 'test') {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Order API',
          version: '1.0.0',
        },
      },
    });

    await app.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });
  }

  app.register(orderRoutes);

  return app;
}
