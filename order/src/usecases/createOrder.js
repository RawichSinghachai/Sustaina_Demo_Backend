import { v4 as uuid } from 'uuid';
import prisma from '../infrastructure/db/prismaClient.js';

export default async function createOrder(data, { orderRepository,cache }) {

  const id = uuid();


  const order = await prisma.$transaction(async (tx) => {
    const repo = orderRepository(tx)
    const order = await repo.createOrder({ id, product: data.product });
    await repo.createOutboxOrder({ id: uuid(),payload: { id: order.id, product: order.product }})
    return order;
  });


  // await cache.del(`order:${order.id}`);
  
  return order;
}
