import "./otel.js";
import Fastify from "fastify";
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "payment-group" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();

      try {
        const order = JSON.parse(value);

        await prisma.payment.upsert({
          where: { id: order.payload.id },
          update: {
            product: order.payload.product,
            receivedAt: new Date(order.sentAt),
          },
          create: {
            id: order.payload.id,
            product: order.payload.product,
            receivedAt: new Date(order.sentAt),
          },
        });

        console.log(
          `Processed order ${order.payload.id} for product ${order.payload.product}`
        );
      } catch (err) {
        console.error("Failed to process message:", err);
      }
    },
  });
}

app.get("/payments", async (request, reply) => {
  try {
    const payments = await prisma.payment.findMany();
    reply.send(payments);
  } catch (err) {
    request.log.error(err);
    reply.status(500).send({ error: "Failed to fetch payments" });
  }
});

app.get("/payment/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return reply.status(404).send({ error: "Payment not found" });
    }

    reply.send(payment);
  } catch (err) {
    request.log.error(err);
    reply.status(500).send({ error: "Failed to fetch payment" });
  }
});

async function main() {
  await startConsumer();
  await app.listen({ port: 3001 });
  console.log("Payment service running at http://localhost:3002");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
