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
  }

  // Sets Context's prototype to originalContext `koa/context`.

  /**
   * The `app.sendMail` delegation.
   *
   * @method sendMail
   * @memberof Context.prototype
   * @return {Promise}
   *
   * @example
   *  let result = yield ctx.sendMail({from: ..., to: ...})
   */

  Context.prototype.sendMail = function sendMail(data) {
    return this.app.sendMail(data);
  };

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
   * Get request user.
   *
   * @return {Mixed} user
   */

  _createClass(Context, [{
    key: 'config',

    /**
     * The `app.config` delegation.
     *
     * @memberof Context.prototype
     * @return {Config}
     */
    get: function get() {
      return this.app.config;
    }

    /**
     * The `app.render` delegation.
     *
     * @memberof Context.prototype
     * @return {GeneratorFunction}
     */
  }, {
    key: 'render',
    get: function get() {
      return this._render;
    },
    set: function set(render) {
      this._render = render;
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
  }, {
    key: 'user',
    get: function get() {
      return this.req.user;
    },

    /**
     * Set request user.
     *
     * @param {Mixed} user
     */
    set: function set(user) {
      this.req.user = user;
    }
  }]);

  return Context;
})();

Object.setPrototypeOf(Context.prototype, _koaLibContext2['default']);

exports['default'] = Context;
module.exports = exports['default'];