import Middleware from 'trek-middleware'
import { Context } from 'trek-engine'

Object.assign(Middleware, {

  install (app) {
    const middleware = new Middleware()

    Reflect.defineProperty(app, 'middleware', { value: middleware })

    return middleware
  }

})

Object.assign(Middleware.prototype, {

  async running (app, req, res) {
    await this.compose(new Context(app, req, res))
  },

  push (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    super.push(fn)
    return this
  }

})

export default Middleware
