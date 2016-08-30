import Middleware from 'trek-middleware'
import Context from '../context'

Object.assign(Middleware, {

  install (app) {
    const middleware = new Middleware()

    Reflect.defineProperty(app, 'middleware', { value: middleware })

    return middleware
  }

})

Object.assign(Middleware.prototype, {

  async running (app, req, res) {
    await this.compose(
      app.raw ? { req, res } : new Context(app, app.config, req, res)
    )
  },

  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    this.push(fn)
    return this
  }

})

export default Middleware
