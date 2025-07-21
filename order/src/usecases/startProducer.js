import prisma from "../infrastructure/db/prismaClient.js";

export default function startProducer({ orderRepository, kafka  }) {

  const repo = orderRepository(prisma);

  return function () {
    setInterval(async () => {
      try {
        const orders = await repo.findPending();

        for (const order of orders) {
          try {
            await kafka.send({
              topic: "orders",
              messages: [
                {
                  key: String(order.id),
                  value: JSON.stringify(order),
                },
              ],
            });

            await repo.markSuccess(order.id);
            console.log(`Sent order ${order.id}, OrderID: ${order.payload.id}, Product: ${order.payload.product}`);
          } catch (error) {
            await repo.markFailed(order.id);
            console.error(`Failed to process order ${order.id}:`, error);
          }
        }
      } catch (err) {
        console.error("Error in outbox polling:", err);
      }

      console.log("Polling OutboxOrder for new messages...");
    }, 5000);
  };
}
