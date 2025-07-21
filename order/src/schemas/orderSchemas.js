import { create } from "domain";

const Order = {
  type: 'object',
  required: ['id', 'product'],
  properties: {
    id: { type: 'string', description: 'Order ID (UUID)' },
    product: { type: 'string', description: 'Product name' },
    createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
  },
};

export const createOrderSchema = {
  body: {
    type: 'object',
    required: ['product'],
    properties: {
      product: { type: 'string', description: 'Name of the product to order' },
    },
  },
  response: {
    201: Order,
  },
  tags: ['Order'],
  summary: 'Create a new order',
  description: 'Create a new order and return the created object',
};

export const getOrderByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Order ID (UUID)' },
    },
  },
  response: {
    200: Order,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
  tags: ['Order'],
  summary: 'Get order by ID',
  description: 'Retrieve a single order by its unique ID',
};

export const getAllOrdersSchema = {
  response: {
    200: {
      type: 'array',
      items: Order,
    },
  },
  tags: ['Order'],
  summary: 'Get all orders',
  description: 'Retrieve a list of all orders',
};

export const updateOrderSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Order ID (UUID)' },
    },
  },
  body: {
    type: 'object',
    required: ['product'],
    properties: {
      product: { type: 'string', description: 'New product name' },
    },
  },
  response: {
    200: Order,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
  tags: ['Order'],
  summary: 'Update order by ID',
  description: 'Update the product field of a specific order',
};

export const deleteOrderSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', description: 'Order ID (UUID)' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Order deleted successfully' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
  tags: ['Order'],
  summary: 'Delete order by ID',
  description: 'Remove an order from the database using its ID',
};
