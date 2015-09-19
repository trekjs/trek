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
 * The app's context.
 *
 * @class Context
 * @extends koa/lib/context
 */

var Context = (function () {
  function Context() {
    _classCallCheck(this, Context);

    this.params = Object.create(null);
  }

  // Sets Context's prototype to originalContext `koa/context`.

  /**
   * The `app.config` delegation.
   *
   * @memberof Context.prototype
   * @return {Config}
   */

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

  Context.prototype.getService = function getService(key) {
    return this.app.getService(key);
  };

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

  Context.prototype.render = function* render(view) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    // merge ctx.state
    options._state = this.state;

    this.body = yield this.app.render(view, options);
  };

  /**
   * Options:
   *    - `filename`
   *    - `disposition`
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

  Context.prototype.json = function json(obj) {
    this.body = obj;
  };

  /**
   * Send JSON response with JSONP callback support.
   *
   * Examples:
   *
   *     res.jsonp(null);
   *     res.jsonp({ user: 'tj' });
   *
   * @param {string|number|boolean|object} obj
   * @public
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

  _createClass(Context, [{
    key: 'config',
    get: function get() {
      return this.app.config;
    }

    /**
     * The `app.logger` delegation.
     *
     * @memberof Context.prototype
     * @return {winston.Logger}
     */
  }, {
    key: 'logger',
    get: function get() {
      return this.app.logger;
    }
  }]);

  return Context;
})();

Object.setPrototypeOf(Context.prototype, _koaLibContext2['default']);

exports['default'] = Context;
module.exports = exports['default'];