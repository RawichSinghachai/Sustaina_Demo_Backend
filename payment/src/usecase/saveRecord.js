import prisma from "../infrastructure/db/prismaClient.js";

export default async function saveRecord(data, { paymentRepository}){

    const repo = paymentRepository(prisma)
    const payment = await repo.upsertPayment(data);
    return payment;
}