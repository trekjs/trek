const pino = require('pino')

const name = 'logger'

module.exports = {
  // If not a class, it's required.
  name,

  install(app) {
    const value = pino(app.config.get(name))

    Reflect.defineProperty(app, name, { value })

    this.installed = true

    return this
  },

  // Context hook
  'context:created'({ logger }, context) {
    Reflect.defineProperty(context, name, { value: logger })
  }
}
