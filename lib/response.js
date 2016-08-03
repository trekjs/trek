import Stream from 'stream'
import vary from 'vary'

export default class Response {

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
    return this
  }

  vary (field) {
    vary(this, field)
  }

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    res.set('Foo', ['bar', 'baz']);
   *    res.set('Accept', 'application/json');
   *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   * @param {String|Object|Array} field
   * @param {String} val
   * @api public
   */

  set (field, val) {
    if (2 == arguments.length) {
      if (Array.isArray(val)) val = val.map(String)
      else val = String(val)
      this.setHeader(field, val)
    } else {
      for (const key in field) {
        this.set(key, field[key])
      }
    }
  }

  send (code, body = null) {
    this.statusCode = code

    // body: null
    if (null === body) return this.end()

    // responses
    if (Buffer.isBuffer(body)) return this.end(body)
    if ('string' === typeof body) return this.end(body)
    if (body instanceof Stream) return body.pipe(this)

    // body: json
    if ('object' === typeof body) {
      this.setHeader('Content-Type', 'application/json')
      this.end(JSON.stringify(body))
    }

    this.end(body)
  }
}
