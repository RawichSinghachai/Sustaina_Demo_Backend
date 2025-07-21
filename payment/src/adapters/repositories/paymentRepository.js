
export default (client) => ({
    upsertPayment(data){
        return client.payment.upsert({
            where: { id: data.payload.id },
            update: { product: data.payload.product, receivedAt: new Date(data.sentAt) },
            create: { id: data.payload.id, product: data.payload.product, receivedAt: new Date(data.sentAt) },
        });
    },
    findAllPayments(){
        return client.payment.findMany();
    },
    findPaymentById(id){
        return client.payment.findUnique({ where: { id } });
    }
})