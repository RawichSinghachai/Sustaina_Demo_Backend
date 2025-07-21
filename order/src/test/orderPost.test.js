import t from 'tap';
import buildApp from '../app.js';

t.test('POST /order', async (t) => {
  const app = await buildApp();
  await app.ready();

  t.teardown(async () => {
    await app.close();
  });

  const res = await app.inject({
    method: 'POST',
    url: '/order',
    payload: {
      product: 'banana',
    },
  });

  const body = JSON.parse(res.body);

  t.equal(res.statusCode, 201);
  t.ok(body.id);
});

// t.test('GET /payments', async (t) => {
//   const app = await buildApp(); 
//   const res = await app.inject({
//     method: 'GET',
//     url: '/orders',
//   });

//   t.equal(res.statusCode, 200, 'Should return 200 status');

//   const payments = res.json();

//   t.ok(Array.isArray(payments), 'Should return an array');

//   for (const payment of payments) {
//     t.type(payment.id, 'string', 'Each payment should have an id');
//     t.type(payment.product, 'string', 'Each payment should have a product');
//     t.type(payment.receivedAt, 'string', 'Each payment should have a valid ISO date');
//   }
//   t.end();

//   await app.close();
// });