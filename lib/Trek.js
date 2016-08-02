import { Server } from 'http'
import onFinished from 'on-finished'
import Middleware from './middleware'
import proxyReq from './request'
import proxyRes from './response'

export default class Trek extends Server {

  constructor () {
    super()
    this.middleware = new Middleware()
  }

  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    this.middleware.push(fn)
    return this
  }

  run (port = 3000, host = '0.0.0.0') {
    // Lazy on request
    this.on('request', (req, res) => {
      onFinished(res, (err) => {
        // todo
      })
      this.middleware.compose({
        req: proxyReq(req),
        res: proxyRes(res)
      })
    })

    return new Promise((resolve, reject) => {
      this.listen(port, host, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

}
