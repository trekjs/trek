import delegateProxy from 'delegate-proxy'
import Request from './request'
import Response from './response'

export default class Context {

  constructor (app, config, req, res) {
    req = delegateProxy(new Request(req), req)
    res = delegateProxy(new Response(res), res)

    Reflect.defineProperty(this, 'app', { value: app })
    Reflect.defineProperty(this, 'req', { value: req })
    Reflect.defineProperty(this, 'res', { value: res })
    Reflect.defineProperty(this, 'config', { value: config })

    Reflect.defineProperty(this.req, 'app', { value: app })
    Reflect.defineProperty(this.req, 'res', { value: res })
    Reflect.defineProperty(this.req, 'config', { value: config })

    Reflect.defineProperty(this.res, 'app', { value: app })
    Reflect.defineProperty(this.res, 'req', { value: req })
    Reflect.defineProperty(this.res, 'config', { value: config })

    // Cache ip
    req.ip = req._ip
  }

}
