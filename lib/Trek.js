import { Server } from 'http'
import Middleware from './Middleware'

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
    this.on('request', (req, res) => {
      this.middleware.compose({ req, res })
    })

    return new Promise((resolve, reject) => {
      this.listen(port, host, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

}
