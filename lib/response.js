import Stream from 'stream'
import vary from 'vary'
import proxy from './proxy'

export class Response {
  constructor (res) {
    this.res = res
  }

  /**
   * Return response header.
   *
   * @return {Object}
   * @api public
   */

  get header () {
    return this._headers || {}
  }

  /**
   * Get response status code.
   *
   * @return {Number}
   * @api public
   */

  get status () {
    return this.statusCode
  }

  /**
   * Set response status code.
   *
   * @param {Number} code
   * @api public
   */

  set status (code) {
    this.statusCode = code
  }

  vary (field) {
    vary(this, field)
  }

  // Must!
  end (...args) {
    return this.res.end(...args)
  }

  send (code, body = null) {
    this.statusCode = code

    // body: null
    if (null === body) return this.end()

    // responses
    if (Buffer.isBuffer(body)) return this.end(body)
    if ('string' === typeof body) return this.end(body)
    if (body instanceof Stream) return body.pipe(res)

    // body: json
    if ('object' === typeof body) {
      this.setHeader('Content-Type', 'application/json')
      this.end(JSON.stringify(body))
    }

    this.end(body)
  }
}

export default (res) => {
  return proxy(new Response(res), res)
}
