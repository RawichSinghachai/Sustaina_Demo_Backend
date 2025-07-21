const tap = require('tap');
const Fastify = require('fastify');
const orderRoutes = require('./routes/order');

const mockPg = {
  connect: async () => ({
    query: async (text, params) => {
      if (text.includes('INSERT')) {
        return { rows: [{ id: params[0], product: params[1] }] };
      }
      if (text.includes('SELECT')) {
        return { rows: [{ id: params[0], product: 'mock-product' }] };
      }
      return { rows: [] };
    },
    release: () => {},
  }),
};

const mockKafkaProducer = {
  send: async () => {},
};

const mockRedis = {
  get: async () => null,
  set: async () => {},
};

tap.test('Order routes', async t => {
  const fastify = Fastify();

  fastify.decorate('pg', mockPg);
  fastify.decorate('producer', mockKafkaProducer);
  fastify.decorate('redis', mockRedis);

  await fastify.register(orderRoutes);
  await fastify.ready();

  t.test('POST /order should create an order', async t => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/order',
      payload: { product: 'apple' },
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.product, 'apple');
  });

  t.test('POST /order should return 400 if no product', async t => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/order',
      payload: {},
    });

    t.equal(response.statusCode, 400);
    const body = JSON.parse(response.payload);
    t.match(body.error, /product is required/);
  });

  t.test('GET /order/:id should return order from db', async t => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/order/123456',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.id, 123456);
    t.equal(body.product, 'mock-product');
  });

  t.teardown(() => fastify.close());
});
