import { Server } from 'http'
import onFinished from 'on-finished'
import Context from './Context'
import Middleware from './middleware'

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
      onFinished(res, err => {
        // handle err
        if (err) {
          console.log(err)
        }
      })
      this.middleware.compose(new Context(req, res))
    })

    return new Promise((resolve, reject) => {
      this.listen(port, host, err => err ? reject(err) : resolve())
    })
  }

}
