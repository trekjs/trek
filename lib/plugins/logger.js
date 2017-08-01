const pino = require('pino')

module.exports = {
  // If not a class, it's required.
  name: 'logger',

  install(app) {
    const value = pino(app.config.get('logger'))

    Reflect.defineProperty(app, 'logger', { value })

    // Context hook
    Reflect.defineProperty(value, 'context:created', { value: contextCreated })

    this.installed = true

    return value
  }
}

function contextCreated(app, context) {
  Reflect.defineProperty(context, 'logger', { value: this })
}
