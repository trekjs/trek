import delegateProxy from 'delegate-proxy'
import Request from './request'
import Response from './response'

export default class Context {

  constructor (req, res) {
    this.req = delegateProxy(new Request(req), req)
    this.res = delegateProxy(new Response(res), res)

    Reflect.defineProperty(this.req, 'res', { value: this.res })
    Reflect.defineProperty(this.res, 'req', { value: this.req })
  }

}
