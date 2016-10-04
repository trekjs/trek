import TrekMiddleware from 'trek-middleware'

export default class Middleware extends TrekMiddleware {

  static install (app) {
    const middleware = new Middleware()

    Reflect.defineProperty(app, 'middleware', { value: middleware })

    return middleware
  }

  // hook: running
  async running (app, context, onError) {
    await app.callHook('context:created', context)
    await this.compose(context)
      .then(() => {
        if (context.res.writable) {
          context.res.status = 404
          context.res.end()
        }
      })
      .catch(onError)
  }

  push (fn) {
    if ('function' !== typeof fn) throw new TypeError('middleware must be a function!')
    super.push(fn)
    return this
  }

}
