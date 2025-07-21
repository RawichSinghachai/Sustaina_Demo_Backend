import prisma from "../infrastructure/db/prismaClient.js";

export default async function getPaymentById(id, {paymentRepository}) {
    
    const repo = paymentRepository(prisma);
    const payment = await repo.findPaymentById(id);
    return payment;
}