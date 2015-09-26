/*!
 * trek - Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _koaSend = require('koa-send');

var _koaSend2 = _interopRequireDefault(_koaSend);

var _koaLibContext = require('koa/lib/context');

var _koaLibContext2 = _interopRequireDefault(_koaLibContext);

/**
 * The app's context
 *
 * @extends {koa/lib/context}
 */

var Context = (function () {
  function Context() {
    _classCallCheck(this, Context);

    this.params = Object.create(null);
  }

  // Sets Context's prototype to originalContext `koa/context`.

  /**
   * The `app.config` delegation
   *
   * @example
   *
   *  ctx.config
   *  // => app.config
   *
   * @returns {Config}
   */

  /**
   * The `app.getService` delegation
   *
   * @example
   *
   *  let db = ctx.getService('sequelize')
   *
   * @returns {Mixed} service
   */

  Context.prototype.getService = function getService(key) {
    return this.app.getService(key);
  };

  /**
   * Render `view` with the given `options`
   *
   * @example
   *
   *  yield ctx.render('site', { name: 'trek' })
   *
   * @param {String} view The name of view
   * @param {Object} options
   * @param {Boolean} options.cache Boolean hinting to the engine it should cache
   * @param {String} options.filename Filename of the view being rendered
   * @returns {void}
   */

  Context.prototype.render = function* render(view) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    // merge ctx.state
    options._state = this.state;

    this.body = yield this.app.render(view, options);
  };

  /**
   * Transfer the file at the given `path`.
   *
   * Automatically sets the _Content-Type_ response header field.
   * When an error occurs. Be sure to check `res.sentHeader`
   * if you wish to attempt responding, as the header and some data
   * may have already been transferred.
   *
   * @example
   *
   *  // The following example illustrates how `ctx.sendFile()` may
   *  // be used as an alternative for the `static()` middleware for
   *  // dynamic situations. The code backing `res.sendFile()` is actually
   *  // the same code, so HTTP cache support etc is identical.
   *
   *  app.get('/user/:uid/photos/:file', function* (next){
   *    var uid = req.params.uid
   *      , file = req.params.file
   *
   *    var yes = yield req.user.mayViewFilesFrom(uid)
   *    if (yes) {
   *      yield ctx.sendFile('/uploads/' + uid + '/' + file)
   *    } else {
   *      ctx.status = 403
   *      ctx.body = 'Sorry! you cant see that.'
   *    }
   *  });
   *
   * @param {String} path The file path
   * @param {Object} options
   * @param {Number} options.maxAge Defaulting to 0 (can be string converted by `ms`)
   * @param {String} options.root Directory for relative filenames
   * @param {Object} options.headers Object of headers to serve with file
   * @returns {void}
   */

  Context.prototype.sendFile = function* sendFile(path) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    var opts = Object.create({
      disposition: 'attachment'
    });
    Object.assign(opts, options);

    if (opts.disposition) {
      var filename = opts.filename || _path.basename(path);
      this.attachment(filename);
    }

    yield _koaSend2['default'](this, path, options);
  };

  /**
   * Send JSON response
   *
   * @example
   *
   *     ctx.json(null);
   *     ctx.json({ user: 'tj' });
   *
   * @param {String|Number|Boolean|Object} obj
   * @returns {void}
   */

  Context.prototype.json = function json(obj) {
    this.body = obj;
  };

  /**
   * Send JSON response with JSONP callback support.
   *
   * @example
   *
   *     ctx.jsonp(null);
   *     ctx.jsonp({ user: 'tj' });
   *
   * @param {String|Number|Boolean|Object} obj
   * @param {String} [Name='callback']
   * @returns {void}
   */

  Context.prototype.jsonp = function jsonp(obj) {
    var name = arguments.length <= 1 || arguments[1] === undefined ? 'callback' : arguments[1];

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
      body = body.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

      // the /**/ is a specific security mitigation for "Rosetta Flash JSONP abuse"
      // the typeof check is just to reduce client error noise
      body = '/**/ typeof ' + callback + ' === \'function\' && ' + callback + '(' + body + ');';
    }

    if (!this.type) {
      this.set('X-Content-Type-Options', 'nosniff');
      this.type = 'js';
    }
    this.body = body;
  };

  /**
   * Check if the request was an `XMLHttpRequest`.
   *
   * @example
   *
   *  if (ctx.xhr) ctx.body = 'AJAX'
   *
   * @returns {Boolean}
   */

  _createClass(Context, [{
    key: 'config',
    get: function get() {
      return this.app.config;
    }

    /**
     * The `app.logger` delegation
     *
     * @example
     *
     *  ctx.logger.info('log somtehing')
     *
     * @returns {winston.Logger}
     */
  }, {
    key: 'logger',
    get: function get() {
      return this.app.logger;
    }
  }, {
    key: 'xhr',
    get: function get() {
      var val = this.get('X-Requested-With') || '';
      return val.toLowerCase() === 'xmlhttprequest';
    }
  }]);

  return Context;
})();

exports['default'] = Context;
Object.setPrototypeOf(Context.prototype, _koaLibContext2['default']);
module.exports = exports['default'];