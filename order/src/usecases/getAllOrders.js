import prisma from '../infrastructure/db/prismaClient.js';

export default async function getAllOrders({ orderRepository }) {
  const repo = orderRepository(prisma)
  return await repo.findAll();
}
