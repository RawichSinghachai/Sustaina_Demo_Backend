import "../otel.js";
import buildApp from './app.js';

import createStartProducer from "./usecases/startProducer.js";
import orderRepository from "./adapters/repositories/orderRepository.js";
import kafka from "./infrastructure/broker/kafkaClient.js";

const app = await buildApp();


const startProducer = createStartProducer({ orderRepository, kafka });

app.listen({ port: 3001 }, (err) => {
  startProducer();
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
