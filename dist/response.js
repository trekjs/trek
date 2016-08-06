'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _vary = require('vary');

var _vary2 = _interopRequireDefault(_vary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Response {

  constructor(res) {
    this.res = res;
  }

  /**
   * Return response header.
   *
   * @return {Object}
   * @api public
   */

  get header() {
    return this._headers || {};
  }

  /**
   * Get response status code.
   *
   * @return {Number}
   * @api public
   */

  get status() {
    return this.statusCode;
  }

  /**
   * Set response status code.
   *
   * @param {Number} code
   * @api public
   */

  set status(code) {
    this.statusCode = code;
    return this;
  }

  vary(field) {
    (0, _vary2.default)(this.res, field);
  }

  /**
   * Return response header.
   *
   * Examples:
   *
   *     res.get('Content-Type')
   *     // => "text/plain"
   *
   *     res.get('content-type')
   *     // => "text/plain"
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  get(field) {
    return this.header[field.toLowerCase()] || '';
  }

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    res.set('Foo', ['bar', 'baz'])
   *    res.set('Accept', 'application/json')
   *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
   *
   * @param {String|Object|Array} field
   * @param {String} val
   * @api public
   */

  set(field, val) {
    if (2 === arguments.length) {
      if (Array.isArray(val)) val = val.map(String);else val = String(val);
      this.setHeader(field, val);
    } else {
      /* eslint guard-for-in: 0 */
      for (const key in field) {
        this.set(key, field[key]);
      }
    }
  }

  /**
   * Append additional header `field` with value `val`.
   *
   * Examples:
   *
   *    res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
   *    res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
   *    res.append('Warning', '199 Miscellaneous warning')
   *
   * @param {String} field
   * @param {String|Array} val
   * @api public
   */

  append(field, val) {
    const prev = this.get(field);

    if (prev) {
      val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val);
    }

    return this.set(field, val);
  }

  send(code, body = null) {
    this.statusCode = code;

    // body: null
    if (null === body) return this.end();

    // responses
    if (Buffer.isBuffer(body)) return this.end(body);
    if ('string' === typeof body) return this.end(body);
    if (body instanceof _stream2.default) return body.pipe(this.res);

    // body: json
    if ('object' === typeof body) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(body));
    }

    this.end(body);
  }
}
exports.default = Response;