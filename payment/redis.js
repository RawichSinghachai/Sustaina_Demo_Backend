const fastifyPlugin = require('fastify-plugin');

async function redisConnector(fastify, options) {
  fastify.register(require('@fastify/redis'), {
    host: '127.0.0.1'
  });
}

module.exports = fastifyPlugin(redisConnector);
