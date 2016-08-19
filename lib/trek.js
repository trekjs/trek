import { Server } from 'http'
import onFinished from 'on-finished'
import Middleware from 'trek-middleware'
import Context from './context'

export default class Trek extends Server {

  constructor () {
    super()
    // just using raw req & raw res
    this.raw = false
    this.initConfig()
    this.middleware = new Middleware()
  }

  initConfig () {
    this.config = new Map()
    this.config.set('subdomain offset', 2)
    this.config.set('trust proxy', false)
  }

  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    this.middleware.push(fn)
    return this
  }

  run () {
    // Lazy on request
    this.on('request', (req, res) => {
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

    try {
      return Promise.resolve(this.listen(...arguments))
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
