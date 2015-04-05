'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.__esModule = true;
/*!
 * trek - Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _originalContext = require('koa/lib/context');

var _originalContext2 = _interopRequireWildcard(_originalContext);

/**
 * The app's context.
 *
 * @class Context
 * @extends koa/lib/context
 */

let Context = (function () {
  function Context() {
    _classCallCheck(this, Context);
  }

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

  _createClass(Context, [{
    key: 'config',

    /**
     * The `app.config` delegation.
     *
     * @memberof Context.prototype
     * @return {Config}
     */
    get: function () {
      return this.app.config;
    }
  }, {
    key: 'logger',

    /**
     * The `app.logger` delegation.
     *
     * @memberof Context.prototype
     * @return {winston.Logger}
     */
    get: function () {
      return this.app.logger;
    }
  }, {
    key: 'user',

    /**
     * Get request user.
     *
     * @return {Mixed} user
     */
    get: function () {
      return this.req.user;
    },

    /**
     * Set request user.
     *
     * @param {Mixed} user
     */
    set: function (user) {
      this.req.user = user;
    }
  }]);

  return Context;
})();

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, _originalContext2['default']);

exports['default'] = Context;
module.exports = exports['default'];