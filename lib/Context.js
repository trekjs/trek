/*!
 * trek - lib/Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var co = _interopRequire(require("co"));

var originalContext = _interopRequire(require("koa/lib/context"));

/**
 * @class Context
 * @extends koa/lib/context
 */

let Context = (function () {
  function Context() {
    _classCallCheck(this, Context);
  }

  /**
   * Delegates `app.sendMail`.
   *
   * @example
   *  let result = yield ctx.sendMail({from: ..., to: ...})
   *
   * @method
   * @public
   * @return {Promise}
   */

  Context.prototype.sendMail = function sendMail(data) {
    return this.app.sendMail(data);
  };

  /**
   * Delegates `app.getService`.
   *
   * @example
   *  let db = ctx.getService('sequelize')
   *
   * @method
   * @public
   * @return {Mixed} service
   */

  Context.prototype.getService = function getService(key) {
    return this.app.getService(key);
  };

  _createClass(Context, {
    config: {

      /**
       * Delegates `app.config`.
       *
       * @public
       * @return {Config}
       */

      get: function () {
        return this.app.config;
      }
    },
    logger: {

      /**
       * Delegates `app.logger`.
       *
       * @public
       * @return {Object}
       */

      get: function () {
        return this.app.logger;
      }
    },
    user: {

      /**
       * Delegates getter `req.user`, the logined user.
       *
       * @public
       */

      get: function () {
        return this.req.user;
      },

      /**
       * Delegates setter `req.user`, the logined user.
       *
       * @public
       */
      set: function (user) {
        this.req.user = user;
      }
    }
  });

  return Context;
})();

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext);

module.exports = Context;