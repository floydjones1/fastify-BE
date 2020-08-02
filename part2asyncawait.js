const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const opts = {
  schema: {
    querystring: { 
      id: { type: 'string' }
    },
    body: {
      type: 'object',
      required: [ 'name' ],
      properties: {
        name: { type: 'string' },
        type: { type: 'number' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      }
    }
  }
}

fastify.post('/post/:id', opts, async (request, reply) => {
  const id = request.params.id
  return { id }
})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
