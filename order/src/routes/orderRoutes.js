import * as orderController from '../adapters/controllers/orderController.js';
import {
  createOrderSchema,
  getOrderByIdSchema,
  getAllOrdersSchema,
  updateOrderSchema,
  deleteOrderSchema,
} from '../schemas/orderSchemas.js';

export default async function orderRoutes(fastify) {
  fastify.post('/order', {
    schema: createOrderSchema,
    handler: orderController.create,
  });

  fastify.get('/order/:id', {
    schema: getOrderByIdSchema,
    handler: orderController.getById,
  });

  fastify.get('/orders', {
    schema: getAllOrdersSchema,
    handler: orderController.getAll,
  });

  fastify.put('/order/:id', {
    schema: updateOrderSchema,
    handler: orderController.update,
  });

  fastify.delete('/order/:id', {
    schema: deleteOrderSchema,
    handler: orderController.remove,
  });
}
