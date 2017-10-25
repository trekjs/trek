const pino = require('pino')

module.exports = {
  // If not a class, it's required.
  name: 'logger',

  install(app) {
    const value = pino(app.config.get('logger'))

    Reflect.defineProperty(app, 'logger', { value })

    this.installed = true

    return this
  },

  // Context hook
  'context:created'({ logger }, context) {
    Reflect.defineProperty(context, 'logger', { value: logger })
  }
}
