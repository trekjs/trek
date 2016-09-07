import TrekMiddleware from 'trek-middleware'
import { Context } from 'trek-engine'

export default class Middleware extends TrekMiddleware {

  static install (app) {
    const middleware = new Middleware()

    Reflect.defineProperty(app, 'middleware', { value: middleware })

    return middleware
  }

  // hook: running
  async running (app, req, res) {
    const context = new Context(app, req, res)
    await app.callHook('context:created', context)
    await this.compose(context)
  }

  push (fn) {
    if ('function' !== typeof fn) throw new TypeError('middleware must be a function!')
    super.push(fn)
    return this
  }

}
