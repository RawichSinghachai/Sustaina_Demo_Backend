import { Kafka } from "kafkajs";
import saveRecord from "../../usecase/saveRecord.js";
import paymentRepository from "../../adapters/repositories/paymentRepository.js";

const kafka = new Kafka({
  clientId: "payment-service",
  brokers: ["localhost:9092"],
});


const consumer = kafka.consumer({ groupId: "payment-group" });

export async function startConsumer() {

    await consumer.connect();
    await consumer.subscribe({ topic: "orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();

      try {
        const order = JSON.parse(value);
        await saveRecord(order, { paymentRepository });

        console.log(
          `Processed order ${order.payload.id} for product ${order.payload.product}`
        );
      } catch (err) {
        console.error("Failed to process message:", err);
      }
    },
  });
}