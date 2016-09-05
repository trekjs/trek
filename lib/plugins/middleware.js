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
    await this.compose(new Context(app, req, res))
  }

  push (fn) {
    if ('function' !== typeof fn) throw new TypeError('middleware must be a function!')
    super.push(fn)
    return this
  }

}
