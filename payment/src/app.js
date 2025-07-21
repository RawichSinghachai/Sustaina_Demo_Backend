import Fastify from 'fastify';
import fastifyMetrics from 'fastify-metrics';
import paymentRoutes from './route/paymentRoutes.js';

export default async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(paymentRoutes);
  await app.register(fastifyMetrics, {
    endpoint: '/metrics',
  });
  return app;
}
