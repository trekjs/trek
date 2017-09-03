const TrekMiddleware = require('trek-middleware')

module.exports = class Middleware extends TrekMiddleware {
  static install(app) {
    const value = new Middleware()

    Reflect.defineProperty(app, 'middleware', { value })

    return value
  }

  // Hook: running
  async running(app, context, onError) {
    await app.callHook('context:created', context)
    await this.compose(context)
      .then(() => app.respond(context))
      .catch(onError)
  }

  push(fn) {
    if (typeof fn !== 'function')
      throw new TypeError('middleware must be a function!')
    super.push(fn)
    return this
  }
}
