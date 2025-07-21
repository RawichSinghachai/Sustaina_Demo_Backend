import { jsonEvent } from '../adapters/eventStoreClient.js';
import prisma from '../infrastructure/db/prismaClient.js';

export default async function updateOrder(id, data, { orderRepository, eventStoreClient, cache }) {

  const repo = orderRepository(prisma)
  const updated = await repo.update(id, data);

  const event = jsonEvent({
    type: 'OrderUpdated',
    data: { id, product: updated.product },
  });

  await eventStoreClient.appendToStream(`order-${id}`, [event]);

  if (updated) {
    // อัปเดต cache ด้วยข้อมูลใหม่
    await cache.set(`order:${id}`, JSON.stringify(updated), 'EX', 300);
  }

  return updated;
}
