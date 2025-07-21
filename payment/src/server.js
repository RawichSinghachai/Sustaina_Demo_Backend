import '../otel.js';
import buildApp from './app.js';
import {startConsumer} from './infrastructure/kafka/consumer.js';


async function main() {
  const app = await buildApp();
  await startConsumer();
  await app.listen({ port: 3002 });
  console.log('Payment service running at http://localhost:3002');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});