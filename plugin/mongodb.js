const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  console.log(options)
  fastify.register(require('fastify-mongodb'), {
    url: 'mongodb://localhost:27018/test_db'
  })
}

module.exports = fastifyPlugin(dbConnector)
