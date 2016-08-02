'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Response = undefined;

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _vary = require('vary');

var _vary2 = _interopRequireDefault(_vary);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

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
  }

  vary(field) {
    (0, _vary2.default)(this, field);
  }

  // Must!
  end(...args) {
    return this.res.end(...args);
  }

  send(code, body = null) {
    this.statusCode = code;

    // body: null
    if (null === body) return this.end();

    // responses
    if (Buffer.isBuffer(body)) return this.end(body);
    if ('string' === typeof body) return this.end(body);
    if (body instanceof _stream2.default) return body.pipe(res);

    // body: json
    if ('object' === typeof body) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(body));
    }

    this.end(body);
  }
}

exports.Response = Response;

exports.default = res => {
  return (0, _proxy2.default)(new Response(res), res);
};