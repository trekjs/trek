import delegateProxy from 'delegate-proxy'
import Request from './request'
import Response from './response'

export default class Context {

  constructor (app, req, res) {
    this.app = app
    this.req = delegateProxy(new Request(req), req)
    this.res = delegateProxy(new Response(res), res)

    Reflect.defineProperty(this.req, 'app', { get: () => app })
    Reflect.defineProperty(this.res, 'app', { get: () => app })

    Reflect.defineProperty(this.req, 'res', { get: () => this.res })
    Reflect.defineProperty(this.res, 'req', { get: () => this.req })

    Reflect.defineProperty(this.req, 'config', { get: () => app.config })
    Reflect.defineProperty(this.res, 'config', { get: () => app.config })
  }

}
