import pino from 'pino'

export default {

  // If not a class, it's required.
  name: 'logger',

  install (app) {
    const value = pino()

    Reflect.defineProperty(app, 'logger', { value })

    // context hook
    Reflect.defineProperty(value, 'context:created', { value: contextCreated })

    this.installed = true

    return value
  }

}

function contextCreated (app, context) {
  Reflect.defineProperty(context, 'logger', { value: this })
}
