import { Server } from 'http'
import onFinished from 'on-finished'
import Middleware from 'trek-middleware'
import Context from './context'

export default class Engine {

  constructor () {
    // just using raw req & raw res
    this.raw = false
    this._init()
  }

  _init () {
    this.middleware = new Middleware()
    this.config = new Map()
    this.config.set('subdomain offset', 2)
    this.config.set('trust proxy', false)
  }

  async run () {
    const server = new Server((req, res) => {
      onFinished(res, err => {
        // handle err
        if (err) {
          console.log(err)
        }
      })
      this.middleware.compose(
        this.raw ? { req, res } : new Context(this, this.config, req, res)
      )
    })

    return await server.listen(...arguments)
  }

  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    this.middleware.push(fn)
    return this
  }

}
