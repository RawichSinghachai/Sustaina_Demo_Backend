import tap from 'tap'
import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import orderRoutes from '../routes/orderRoutes.js' // ✅ import routes

const prisma = new PrismaClient()

tap.test('Order routes', async t => {
  const app = Fastify()

  // ✅ Register route ก่อน test
  await app.register(orderRoutes)

  await app.ready()

  // ✅ เคลียร์ข้อมูลก่อนเริ่ม
  await prisma.order.deleteMany()

  let orderId

  t.test('POST /order', async t => {
    const res = await app.inject({
      method: 'POST',
      url: '/order',
      payload: {
        product: 'Test Product'
      },
      headers: { 'content-type': 'application/json' }
    })

    t.equal(res.statusCode, 201)
    const body = res.json()
    t.ok(body.id)
    t.equal(body.product, 'Test Product')
    orderId = body.id
  })

  t.test('GET /orders', async t => {
    const res = await app.inject({
      method: 'GET',
      url: '/orders'
    })

    t.equal(res.statusCode, 200)
    const orders = res.json()
    t.ok(Array.isArray(orders))
    t.equal(orders.length, 1)
  })

  t.test('GET /order/:id', async t => {
    const res = await app.inject({
      method: 'GET',
      url: `/order/${orderId}`
    })

    t.equal(res.statusCode, 200)
    const order = res.json()
    t.equal(order.id, orderId)
  })

  t.test('PUT /order/:id', async t => {
    const res = await app.inject({
      method: 'PUT',
      url: `/order/${orderId}`,
      payload: { product: 'Updated Product' },
      headers: { 'content-type': 'application/json' }
    })

    t.equal(res.statusCode, 200)
    t.equal(res.json().product, 'Updated Product')
  })

  t.test('DELETE /order/:id', async t => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/order/${orderId}`
    })

    t.equal(res.statusCode, 200)
    t.match(res.json(), { message: 'Order deleted successfully' })
  })

  // ✅ Cleanup
  t.teardown(async () => {
    await app.close()
    await prisma.$disconnect()
  })
})
