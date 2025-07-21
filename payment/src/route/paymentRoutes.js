import * as paymentController from "../adapters/controllers/paymentController.js";

export default async function paymentRoutes(fastify) {
  fastify.get("/payments", paymentController.getAll);
  fastify.get("/payments/:id", paymentController.getById);
}