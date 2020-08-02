const opt = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          world: { type: 'string' }
        }
      }
    }
  }
}

async function routes (fastify, options, done) {
  fastify.get('/', opt, function (req, res) {
    return { world: 'hello' }
  })

  done()
}

module.exports = routes
