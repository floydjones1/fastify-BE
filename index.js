const fastify = require('fastify')({ logger: true })

fastify.register(require('./plugin/mongodb'))
fastify.register(require('./plugin/routes'))
fastify.register(require('./plugin/routes2'), { prefix: '/v2' })

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info('started server')
  } catch (err) {
    process.exit(1)
  }
}
start()
