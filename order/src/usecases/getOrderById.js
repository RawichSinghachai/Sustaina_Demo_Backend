import prisma from '../infrastructure/db/prismaClient.js';

export default async function getOrderById(id, { orderRepository, cache }) {
  const cacheKey = `order:${id}`;

  // 1. เช็ค cache
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. query DB
  const repo = orderRepository(prisma)
  const order = await repo.findById(id);
  if (!order) return null;

  // 3. เก็บลง cache
  await cache.set(cacheKey, JSON.stringify(order), 'EX', 300); // TTL 5 นาที
  return order;
}
