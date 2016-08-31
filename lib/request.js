/* eslint max-lines: ["error", 1000] */
import { format as stringify } from 'url'
import qs from 'querystring'
import accepts from 'accepts'
import contentType from 'content-type'
import fresh from 'fresh'
import typeis from 'type-is'
import parseRange from 'range-parser'
import parse from 'parseurl'

const METHODS = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE']

export default class Request {

  constructor (req) {
    this.req = req
    this.originalUrl = req.originalUrl = req.url
  }

  get socket () {
    return this.req.socket
  }

  set socket (socket) {
    this.req.socket = socket
  }

  get method () {
    return this.req.method
  }

  set method (method) {
    this.req.method = method
  }

  get url () {
    return this.req.url
  }

  set url (url) {
    this.req.url = url
  }

  /**
   * Return request header.
   *
   * @return {Object}
   * @api public
   */

  get header () {
    return this.headers
  }

  get headers () {
    return this.req.headers
  }

  /**
   * Return request header.
   *
   * @return {Object}
   * @api private
   */

  get accept () {
    if (this._accept) return this._accept
    this._accept = accepts(this.req)
    return this._accept
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

  accepts () {
    return this.accept.types(...arguments)
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

  acceptsEncodings () {
    return this.accept.encodings(...arguments)
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

  acceptsCharsets () {
    return this.accept.charsets(...arguments)
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

  acceptsLanguages () {
    return this.accept.languages(...arguments)
  }

  /**
   * Get the charset when present or undefined.
   *
   * @return {String}
   * @api public
   */

  get charset () {
    const type = this.get('Content-Type')
    if (!type) return ''
    return contentType.parse(type).parameters.charset || ''
  }

  /**
   * Check if the request is fresh, aka
   * Last-Modified and/or the ETag
   * still match.
   *
   * @return {Boolean}
   * @api public
   */

  get fresh () {
    const method = this.method
    const s = this.res.status

    // GET or HEAD for weak freshness validation only
    if ('GET' !== method && 'HEAD' !== method) return false

    // 2xx or 304 as per rfc2616 14.26
    if ((s >= 200 && s < 300) || 304 === s) {
      return fresh(this.header, this.res.header)
    }

    return false
  }

  /**
   * Check if the request is stale, aka
   * "Last-Modified" and / or the "ETag" for the
   * resource has changed.
   *
   * @return {Boolean}
   * @api public
   */

  get stale () {
    return !this.fresh
  }

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname:port
   * @api public
   */

  get host () {
    let host = this.config.get('trust proxy') && this.get('X-Forwarded-Host')
    host = host || this.get('Host')
    if (!host) return ''
    return host.split(/\s*,\s*/)[0]
  }

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   *
   * @return {String} hostname
   * @api public
   */

  get hostname () {
    const host = this.host
    if (!host) return ''
    return host.split(':')[0]
  }

  /**
   * Return subdomains as an array.
   *
   * Subdomains are the dot-separated parts of the host before the main domain of
   * the app. By default, the domain of the app is assumed to be the last two
   * parts of the host. This can be changed by setting "subdomain offset".
   *
   * For example, if the domain is "tobi.ferrets.example.com":
   * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
   * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
   *
   * @return {Array}
   * @public
   */

  get subdomains () {
    return (this.host || '')
      .split('.')
      .reverse()
      .slice(this.config.get('subdomain offset'))
  }

  /**
   * Return the protocol string "http" or "https"
   * when requested with TLS. When the proxy setting
   * is enabled the "X-Forwarded-Proto" header
   * field will be trusted. If you're running behind
   * a reverse proxy that supplies https for you this
   * may be enabled.
   *
   * @return {String}
   * @api public
   */

  get protocol () {
    const proxy = this.config.get('trust proxy')
    if (this.socket.encrypted) return 'https'
    if (!proxy) return 'http'
    const proto = this.get('X-Forwarded-Proto') || 'http'
    return proto.split(/\s*,\s*/)[0]
  }

  /**
   * Short-hand for:
   *
   *    req.protocol == 'https'
   *
   * @return {Boolean}
   * @api public
   */

  get secure () {
    return 'https' === this.protocol
  }

  /**
   * Get origin of URL.
   *
   * @return {String}
   * @api public
   */

  get origin () {
    return `${this.protocol}://${this.host}`
  }

  /**
   * Get full request URL.
   *
   * @return {String}
   * @api public
   */

  get href () {
    // support: `GET http://example.com/foo`
    if (/^https?:\/\//i.test(this.originalUrl)) return this.originalUrl
    return this.origin + this.originalUrl
  }

  /**
   * Check if the request is idempotent.
   *
   * @return {Boolean}
   * @api public
   */

  get idempotent () {
    return METHODS.indexOf(this.method) !== -1
  }

  /**
   * Return the remote address from the trusted proxy.
   *
   * The is the remote address on the socket unless
   * "trust proxy" is set.
   *
   * @return {String}
   * @private
   */

  get _ip () {
    return this.ips[0] || this.socket.remoteAddress || ''
  }

  /**
   * When `app.proxy` is `true`, parse
   * the "X-Forwarded-For" ip address list.
   *
   * For example if the value were "client, proxy1, proxy2"
   * you would receive the array `["client", "proxy1", "proxy2"]`
   * where "proxy2" is the furthest down-stream.
   *
   * @return {Array}
   * @api public
   */

  get ips () {
    const proxy = this.config.get('trust proxy')
    const val = this.get('X-Forwarded-For')
    return proxy && val ? val.split(/\s*,\s*/) : []
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

  range (size, options) {
    const range = this.get('Range')
    if (!range) return
    return parseRange(size, range, options)
  }

  /**
   * Get request pathname.
   *
   * @return {String}
   * @api public
   */

  get path () {
    return parse(this.req).pathname
  }

  /**
   * Set pathname, retaining the query-string when present.
   *
   * @param {String} path
   * @api public
   */

  set path (path) {
    const url = parse(this.req)
    if (url.pathname === path) return

    url.pathname = path
    url.path = null
    this.url = stringify(url)
  }

  /**
   * Get parsed query-string.
   *
   * @return {Object}
   * @api public
   */

  get query () {
    const str = this.querystring
    const c = this._querycache = this._querycache || {}
    const q = c[str] || (c[str] = qs.parse(str))
    return q
  }

  /**
   * Set query-string as an object.
   *
   * @param {Object} obj
   * @api public
   */

  set query (obj) {
    this.querystring = qs.stringify(obj)
  }

  /**
   * Get query string.
   *
   * @return {String}
   * @api public
   */

  get querystring () {
    if (!this.req) return ''
    return parse(this.req).query || ''
  }

  /**
   * Set querystring.
   *
   * @param {String} str
   * @api public
   */

  set querystring (str) {
    const url = parse(this.req)
    if (url.search === `?${str}`) return

    url.search = str
    url.path = null

    this.url = stringify(url)
  }

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   *
   * @return {String}
   * @api public
   */

  get search () {
    if (!this.querystring) return ''
    return `?${this.querystring}`
  }

  /**
   * Set the search string. Same as
   * response.querystring= but included for ubiquity.
   *
   * @param {String} str
   * @api public
   */

  set search (str) {
    this.querystring = str
  }

  /**
   * Return parsed Content-Length when present.
   *
   * @return {Number}
   * @api public
   */

  get length () {
    const len = this.get('Content-Length')
    if (len === '') return
    return ~~len
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

  is (types) {
    if (!types) return typeis(this.req)
    if (!Array.isArray(types)) types = [...arguments]
    return typeis(this.req, types)
  }

  /**
   * Return the request mime type void of
   * parameters such as "charset".
   *
   * @return {String}
   * @api public
   */

  get type () {
    const type = this.get('Content-Type')
    if (!type) return ''
    return type.split(';')[0]
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

  get (field) {
    switch ((field = field.toLowerCase())) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer || ''
      default:
        return this.headers[field] || ''
    }
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect () {
    if (!this.req) return
    return this.toJSON()
  }

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  toJSON () {
    return {
      method: this.method,
      url: this.url,
      header: this.header
    }
  }
}
