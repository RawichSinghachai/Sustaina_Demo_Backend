
export default (client) => ({
  createOrder(data) {
    return client.order.create({ data });
  },
  findById(id) {
    return client.order.findUnique({ where: { id } });
  },
  findAll() {
    return client.order.findMany();
  },
  update(id, { product }) {
    return client.order.update({
      where: { id },
      data: { product }
    });
  },
  delete(id) {
    return client.order.delete({
      where: { id }
    }).catch(() => null);
  },
  createOutboxOrder(data) {
    return client.outboxOrder.create({ data });
  },

  findPending() {
    return  client.outboxOrder.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 10,
    });
  },

  async markSuccess(id) {
    await client.outboxOrder.update({
      where: { id },
      data: { status: "SUCCESS", sentAt: new Date() },
    });
  },

  async markFailed(id) {
    await client.outboxOrder.update({
      where: { id },
      data: { status: "FAILED" },
    });
  },
});
