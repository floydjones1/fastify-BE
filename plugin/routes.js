const todosGetOpt = {
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            status: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' }
          }
        }
      }
    }
  }
}

const todoGetOpt = {
  schema: {
    querystring: {
      id: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}

const todoPostOpts = {
  schema: {
    body: {
      name: { type: 'string' },
      status: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'doing', 'done'] },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}

const todoPUTOpts = {
  schema: {
    body: {
      _id: { type: 'string' },
      status: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' }
        }
      }
    }
  }
}

const todoDeleteOpts = {
  schema: {
    querystring: {
      id: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' }
        }
      }
    }
  }
}

async function routes (fastify, option, done) {
  const todoCollection = fastify.mongo.db.collection('todo')

  fastify.decorate('auth', (request) => request.headers.auth === 'secret')

  fastify.get('/', async (req, res) => {
    return { hello: 'world' }
  })

  fastify.get('/todos', todosGetOpt, async (req, res) => {
    const todos = await todoCollection.find().toArray()
    return todos
  })

  fastify.get('/todo/:id', todoGetOpt, async (req, res) => {
    return { status: req.params.id }
  })

  fastify.register(function (fastify, options, done) {
    fastify.addHook('preHandler', async (request, reply) => {
      if (!fastify.auth(request)) {
        const err = new Error()
        err.statusCode = 401
        err.message = 'not authorized'
        throw err
      }
    })
    fastify.post('/todo', todoPostOpts, async (req, res) => {
      const todo = req.body
      todo.created_at = new Date()
      todo.updated_at = new Date()
      const result = await todoCollection.insertOne(todo)
      const insertedTodo = result.ops[0]
      return insertedTodo
    })

    fastify.put('/todo', todoPUTOpts, async (req, res) => {
      let { _id, status } = req.body
      _id = fastify.mongo.ObjectId(_id)
      try {
        const result = await todoCollection.findOneAndUpdate({ _id }, { $set: { status, updated_at: new Date() } }, { returnOriginal: false })
        return result.value
      } catch (error) {
        error.statusCode = 500
        console.log(error)
        return error
      }
    })

    fastify.delete('/todo/:id', todoDeleteOpts, async (req, res) => {
      const { id } = req.params
      const _id = fastify.mongo.ObjectId(id)
      try {
        const result = await todoCollection.deleteOne({ _id })
        console.log(result)
        return { status: true }
      } catch (error) {
        console.log(error)
        return { status: false }
      }
    })
    done()
  })
}

module.exports = routes
