/*!
 * trek - Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { basename } from 'path'
import send from 'koa-send'
import originalContext from 'koa/lib/context'

/**
 * The app's context
 *
 * @extends koa/lib/context
 */
export default class Context {

  constructor() {
    this.params = Object.create(null)
  }

  /**
   * The `app.config` delegation
   *
   * @returns {Config}
   */
  get config() {
    return this.app.config
  }

  /**
   * The `app.logger` delegation
   *
   * @example
   *  ctx.logger.info('log somtehing')
   *
   * @returns {winston.Logger}
   */
  get logger() {
    return this.app.logger
  }

  /**
   * The `app.getService` delegation
   *
   * @example
   *  let db = ctx.getService('sequelize')
   *
   * @returns {Mixed} service
   */
  getService(key) {
    return this.app.getService(key)
  }

  /**
   * Render `view` with the given `options`
   *
   * @example
   *  yield ctx.render('site', { name: 'trek' })
   *
   * @param {String} view The name of view
   * @param {Object} options
   * @param {Boolean} options.cache Boolean hinting to the engine it should cache
   * @param {String} options.filename Filename of the view being rendered
   * @returns {void}
   */
  *render(view, options = Object.create(null)) {
    // merge ctx.state
    options._state = this.state

    this.body = yield this.app.render(view, options)
  }

  /**
   * Transfer the file at the given `path`.
   *
   * Automatically sets the _Content-Type_ response header field.
   * The callback `callback(err)` is invoked when the transfer is complete
   * or when an error occurs. Be sure to check `res.sentHeader`
   * if you wish to attempt responding, as the header and some data
   * may have already been transferred.
   *
   * @example
   *
   * // The following example illustrates how `ctx.sendFile()` may
   * // be used as an alternative for the `static()` middleware for
   * // dynamic situations. The code backing `res.sendFile()` is actually
   * // the same code, so HTTP cache support etc is identical.
   *
   *     app.get('/user/:uid/photos/:file', function*(next){
   *       var uid = req.params.uid
   *         , file = req.params.file
   *
   *       var yes = yield req.user.mayViewFilesFrom(uid)
   *       if (yes) {
   *         yield ctx.sendFile('/uploads/' + uid + '/' + file)
   *       } else {
   *         ctx.status = 403
   *         ctx.body = 'Sorry! you cant see that.'
   *       }
   *     });
   *
   * @param {String} path The file path
   * @param {Object} options
   * @param {Number} options.maxAge Defaulting to 0 (can be string converted by `ms`)
   * @param {String} options.root Directory for relative filenames
   * @param {Object} options.headers Object of headers to serve with file
   * @returns {void}
   */
  *sendFile(path, options = Object.create(null)) {
    var opts = Object.create({
      disposition: 'attachment'
    })
    Object.assign(opts, options)

    if (opts.disposition) {
      var filename = opts.filename || basename(path)
      this.attachment(filename)
    }

    yield send(this, path, options)
  }

  /**
   * Send JSON response
   *
   * @example
   *     ctx.json(null);
   *     ctx.json({ user: 'tj' });
   *
   * @param {String|Number|Boolean|Object} obj
   * @returns {void}
   */
  json(obj) {
    this.body = obj
  }

  /**
   * Send JSON response with JSONP callback support.
   *
   * @example
   *     ctx.jsonp(null);
   *     ctx.jsonp({ user: 'tj' });
   *
   * @param {String|Number|Boolean|Object} obj
   * @param {String} [Name='callback']
   * @returns {void}
   */
  jsonp(obj, name = 'callback') {
    var body = JSON.stringify(obj)
    var callback = this.query[name]

    // fixup callback
    if (Array.isArray(callback)) {
      callback = callback[0]
    }

    // jsonp
    if (typeof callback === 'string' && callback.length !== 0) {

      // restrict callback charset
      callback = callback.replace(/[^\[\]\w$.]/g, '')

      // replace chars not allowed in JavaScript that are in JSON
      body = body
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')

      // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
      // the typeof check is just to reduce client error noise
      body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');'
    }

    if (!this.type) {
      this.set('X-Content-Type-Options', 'nosniff')
      this.type = 'js'
    }
    this.body = body
  }

  /**
   * Check if the request was an `XMLHttpRequest`.
   *
   * @example
   *  if (ctx.xhr) ctx.body = 'AJAX'
   *
   * @returns {Boolean}
   */
  get xhr() {
    var val = this.get('X-Requested-With') || ''
    return val.toLowerCase() === 'xmlhttprequest'
  }

}

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext)
