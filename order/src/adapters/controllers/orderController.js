import createOrder from '../../usecases/createOrder.js';
import getOrderById from '../../usecases/getOrderById.js';
import getAllOrders from '../../usecases/getAllOrders.js';
import updateOrder from '../../usecases/updateOrder.js';
import deleteOrder from '../../usecases/deleteOrder.js';

import orderRepository from '../repositories/orderRepository.js';
import kafka from '../../infrastructure/broker/kafkaClient.js';
import cache from '../../infrastructure/cache/redisClient.js';
import eventStoreClient  from '../../adapters/eventStoreClient.js';


export async function create(req, reply) {
  const { product } = req.body;
  if (!product) return reply.status(400).send({ error: 'product is required' });

  try {
    const order = await createOrder({ product }, { orderRepository, eventStoreClient, cache });
    return reply.code(201).send(order);
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to create order' });
  }
}

export async function getById(req, reply) {
  const { id } = req.params;

  try {
    const order = await getOrderById(id, { orderRepository, cache });
    if (!order) return reply.status(404).send({ error: 'Order not found' });
    return order;
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to fetch order' });
  }
}

export async function getAll(req, reply) {
  try {
    const orders = await getAllOrders({ orderRepository });
    return orders;
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to fetch orders' });
  }
}

export async function update(req, reply) {
  const { id } = req.params;
  const { product } = req.body;
  if (!product) return reply.status(400).send({ error: 'product is required' });

  try {
    const order = await updateOrder(id, { product }, { orderRepository, eventStoreClient, cache });
    if (!order) return reply.status(404).send({ error: 'Order not found' });
    return order;
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to update order' });
  }
}

export async function remove(req, reply) {
  const { id } = req.params;

  try {
    const result = await deleteOrder(id, { orderRepository, eventStoreClient, cache });
    if (!result) return reply.status(404).send({ error: 'Order not found' });
    return { message: 'Order deleted successfully' };
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to delete order' });
  }
}
