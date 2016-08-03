'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _accepts = require('accepts');

var _accepts2 = _interopRequireDefault(_accepts);

var _contentType = require('content-type');

var _contentType2 = _interopRequireDefault(_contentType);

var _fresh = require('fresh');

var _fresh2 = _interopRequireDefault(_fresh);

var _typeIs = require('type-is');

var _typeIs2 = _interopRequireDefault(_typeIs);

var _rangeParser = require('range-parser');

var _rangeParser2 = _interopRequireDefault(_rangeParser);

var _parseurl = require('parseurl');

var _parseurl2 = _interopRequireDefault(_parseurl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Request {

  constructor(req) {
    this.req = req;
  }

  /**
   * Return request header.
   *
   * @return {Object}
   * @api public
   */

  get header() {
    return this.headers;
  }

  /**
   * Return request header.
   *
   * @return {Object}
   * @api private
   */

  get accept() {
    return (0, _accepts2.default)(this.req);
  }

  /**
   * Check if the given `type(s)` is acceptable, returning
   * the best match when true, otherwise `undefined`, in which
   * case you should respond with 406 "Not Acceptable".
   *
   * The `type` value may be a single mime type string
   * such as "application/json", the extension name
   * such as "json" or an array `["json", "html", "text/plain"]`. When a list
   * or array is given the _best_ match, if any is returned.
   *
   * Examples:
   *
   *     // Accept: text/html
   *     req.accepts('html')
   *     // => "html"
   *
   *     // Accept: text/*, application/json
   *     req.accepts('html')
   *     // => "html"
   *     req.accepts('text/html')
   *     // => "text/html"
   *     req.accepts('json', 'text')
   *     // => "json"
   *     req.accepts('application/json')
   *     // => "application/json"
   *
   *     // Accept: text/*, application/json
   *     req.accepts('image/png')
   *     req.accepts('png')
   *     // => undefined
   *
   *     // Accept: text/*;q=.5, application/json
   *     req.accepts(['html', 'json'])
   *     req.accepts('html', 'json')
   *     // => "json"
   *
   * @param {String|Array} type(s)...
   * @return {String|Array|Boolean}
   * @api public
   */

  accepts() {
    return this.accept.types(...arguments);
  }

  /**
   * Return accepted encodings or best fit based on `encodings`.
   *
   * Given `Accept-Encoding: gzip, deflate`
   * an array sorted by quality is returned:
   *
   *     ['gzip', 'deflate']
   *
   * @param {String|Array} encoding(s)...
   * @return {String|Array}
   * @api public
   */

  acceptsEncodings() {
    return this.accept.encodings(...arguments);
  }

  /**
   * Return accepted charsets or best fit based on `charsets`.
   *
   * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
   * an array sorted by quality is returned:
   *
   *     ['utf-8', 'utf-7', 'iso-8859-1']
   *
   * @param {String|Array} charset(s)...
   * @return {String|Array}
   * @api public
   */

  acceptsCharsets() {
    return this.accept.charsets(...arguments);
  }

  /**
   * Return accepted languages or best fit based on `langs`.
   *
   * Given `Accept-Language: en;q=0.8, es, pt`
   * an array sorted by quality is returned:
   *
   *     ['es', 'pt', 'en']
   *
   * @param {String|Array} lang(s)...
   * @return {Array|String}
   * @api public
   */

  acceptsLanguages() {
    return this.accept.languages(...arguments);
  }

  /**
   * Get the charset when present or undefined.
   *
   * @return {String}
   * @api public
   */

  get charset() {
    const type = this.get('Content-Type');
    return type && _contentType2.default.parse(type).parameters.charset || '';
  }

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   *
   * @return {Boolean}
   * @api public
   */

  get fresh() {
    const method = this.method;
    const s = this.res.status;

    // GET or HEAD for weak freshness validation only
    if ('GET' !== method && 'HEAD' !== method) return false;

    // 2xx or 304 as per rfc2616 14.26
    if (s >= 200 && s < 300 || 304 == s) {
      return (0, _fresh2.default)(this.header, this.res.header);
    }

    return false;
  }

  /**
   * Parse Range header field, capping to the given `size`.
   *
   * Unspecified ranges such as "0-" require knowledge of your resource length. In
   * the case of a byte range this is of course the total number of bytes. If the
   * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
   * and `-2` when syntactically invalid.
   *
   * When ranges are returned, the array has a "type" property which is the type of
   * range that is required (most commonly, "bytes"). Each array element is an object
   * with a "start" and "end" property for the portion of the range.
   *
   * The "combine" option can be set to `true` and overlapping & adjacent ranges
   * will be combined into a single range.
   *
   * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
   * should respond with 4 users when available, not 3.
   *
   * @param {number} size
   * @param {object} [options]
   * @param {boolean} [options.combine=false]
   * @return {number|array}
   * @public
   */

  range(size, options) {
    const range = this.get('Range');
    if (!range) return;
    return (0, _rangeParser2.default)(size, range, options);
  }

  /**
   * Get origin of URL.
   *
   * @return {String}
   * @api public
   */

  get origin() {
    return `${ this.protocol }://${ this.host }`;
  }

  /**
   * Get request pathname.
   *
   * @return {String}
   * @api public
   */

  get path() {
    return (0, _parseurl2.default)(this).pathname;
  }

  /**
   * Set pathname, retaining the query-string when present.
   *
   * @param {String} path
   * @api public
   */

  set path(path) {
    const url = (0, _parseurl2.default)(this);
    if (url.pathname === path) return;

    url.pathname = path;
    url.path = null;
    this.url = (0, _url.format)(url);
  }

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   *
   * @return {String}
   * @api public
   */

  get search() {
    if (!this.querystring) return '';
    return `?${ this.querystring }`;
  }

  /**
   * Set the search string. Same as
   * response.querystring= but included for ubiquity.
   *
   * @param {String} str
   * @api public
   */

  set search(str) {
    this.querystring = str;
  }

  /**
   * Check if the incoming request contains the "Content-Type"
   * header field, and it contains any of the give mime `type`s.
   * If there is no request body, `null` is returned.
   * If there is no content type, `false` is returned.
   * Otherwise, it returns the first `type` that matches.
   *
   * Examples:
   *
   *     // With Content-Type: text/html; charset=utf-8
   *     req.is('html') // => 'html'
   *     req.is('text/html') // => 'text/html'
   *     req.is('text/*', 'application/json') // => 'text/html'
   *
   *     // When Content-Type is application/json
   *     req.is('json', 'urlencoded') // => 'json'
   *     req.is('application/json') // => 'application/json'
   *     req.is('html', 'application/*') // => 'application/json'
   *
   *     req.is('html'); // => false
   *
   * @param {String|Array} types...
   * @return {String|false|null}
   * @api public
   */

  is(types) {
    if (!types) return (0, _typeIs2.default)(this);
    if (!Array.isArray(types)) types = [...arguments];
    return (0, _typeIs2.default)(this, types);
  }

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  get type() {
    const type = this.get('Content-Type');
    if (!type) return '';
    return type.split(';')[0];
  }

  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     req.get('Content-Type')
   *     // => "text/plain"
   *
   *     req.get('content-type')
   *     // => "text/plain"
   *
   *     req.get('Something')
   *     // => undefined
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  get(field) {
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer || '';
      default:
        return this.headers[field] || '';
    }
  }
}
exports.default = Request;