const fastify = require('fastify')({
  logger: true
})

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    fastify.exit(1)
  }
})
