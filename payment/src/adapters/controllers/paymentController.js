import paymentRepository from '../repositories/paymentRepository.js';

import getPaymentById from '../../usecase/getPaymentById.js';
import getAllPayments from '../../usecase/getAllPayment.js';

export async function getAll(req, reply) {
  try {
    const payments = await getAllPayments({ paymentRepository });
    return reply.code(200).send(payments);
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to retrieve payments' });
  }
}

export async function getById(req, reply) {
  const { id } = req.params;
  try {
    const payment = await getPaymentById(id, { paymentRepository });
    if (!payment) return reply.status(404).send({ error: 'Payment not found' });
    return reply.code(200).send(payment);
  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Failed to retrieve payment' });
  }
}