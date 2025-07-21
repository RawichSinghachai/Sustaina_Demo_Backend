import { jsonEvent } from '../adapters/eventStoreClient.js';
import prisma from '../infrastructure/db/prismaClient.js';

export default async function deleteOrder(id, { orderRepository, eventStoreClient, cache }) {

  const repo = orderRepository(prisma)
  const deleted = await repo.delete(id);

  const event = jsonEvent({
    type: 'OrderDeleted',
    data: { id },
  });

  await eventStoreClient.appendToStream(`order-${id}`, [event]);

  if (deleted) {
    await cache.del(`order:${id}`); // ลบ cache ถ้ามี
  }
  return deleted;
}
