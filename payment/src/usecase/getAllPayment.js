import prisma from "../infrastructure/db/prismaClient.js";

export default async function getAllPayments({ paymentRepository }) {
    const repo = paymentRepository(prisma);
    const payments = await repo.findAllPayments();
    return payments;
}
