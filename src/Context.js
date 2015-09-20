/*!
 * trek - Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { basename } from 'path';
import send from 'koa-send';
import originalContext from 'koa/lib/context';

/**
 * The app's context.
 *
 * @class Context
 * @extends koa/lib/context
 */
class Context {

  constructor() {
    this.params = Object.create(null);
  }

  /**
   * The `app.config` delegation.
   *
   * @memberof Context.prototype
   * @return {Config}
   */
  get config() {
    return this.app.config;
  }

  /**
   * The `app.logger` delegation.
   *
   * @memberof Context.prototype
   * @return {winston.Logger}
   */
  get logger() {
    return this.app.logger;
  }

  /**
   * The `app.getService` delegation.
   *
   * @example
   *  let db = ctx.getService('sequelize')
   *
   * @method getService
   * @memberof Context.prototype
   * @return {Mixed} service
   */
  getService(key) {
    return this.app.getService(key);
  }

  /**
   * Render `view` with the given `options`.
   *
   * Options:
   *
   *  - `cache`     boolean hinting to the engine it should cache
   *  - `filename`  filename of the view being rendered
   *
   * @public
   */
  *render(view, options = Object.create(null)) {
    // merge ctx.state
    options._state = this.state;

    this.body = yield this.app.render(view, options);
  }

  /**
   * Options:
   *    - `filename`
   *    - `disposition`
   */
  *sendFile(path, options = Object.create(null)) {
    var opts = Object.create({
      disposition: 'attachment'
    });
    Object.assign(opts, options);

    if (opts.disposition) {
      var filename = opts.filename || basename(path);
      this.attachment(filename);
    }

    yield send(this, path, options);
  }

  /**
   * Send JSON response.
   *
   * Examples:
   *
   *     ctx.json(null);
   *     ctx.json({ user: 'tj' });
   *
   * @param {string|number|boolean|object} obj
   * @public
   */
  json(obj) {
    this.body = obj;
  }

  /**
   * Send JSON response with JSONP callback support.
   *
   * Examples:
   *
   *     ctx.jsonp(null);
   *     ctx.jsonp({ user: 'tj' });
   *
   * @param {string|number|boolean|object} obj
   * @public
   */
  jsonp(obj, name = 'callback') {
    var body = JSON.stringify(obj);
    var callback = this.query[name];

    // fixup callback
    if (Array.isArray(callback)) {
      callback = callback[0];
    }

    // jsonp
    if (typeof callback === 'string' && callback.length !== 0) {

      // restrict callback charset
      callback = callback.replace(/[^\[\]\w$.]/g, '');

      // replace chars not allowed in JavaScript that are in JSON
      body = body
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

      // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
      // the typeof check is just to reduce client error noise
      body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
    }

    if (!this.type) {
      this.set('X-Content-Type-Options', 'nosniff');
      this.type = 'js';
    }
    this.body = body;
  }

  /**
   * Check if the request was an _XMLHttpRequest_.
   *
   * @return {Boolean}
   * @public
   */
  get xhr() {
    var val = this.get('X-Requested-With') || '';
    return val.toLowerCase() === 'xmlhttprequest';
  }

}

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext);

export default Context;
