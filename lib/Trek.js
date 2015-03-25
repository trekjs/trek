/*!
 * trek - lib/Trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var delegate = _interopRequire(require("delegates"));

var Engine = _interopRequire(require("./Engine"));

/**
 * Trek Secret Keys.
 * @constant
 * @default
 * @private
 */
const TREK_KEYS = ["Star Trek", "Spock", "Trek"];

/**
 * @class Trek
 * @public
 */

let Trek = (function (_Engine) {
  function Trek() {
    _classCallCheck(this, Trek);

    if (_Engine != null) {
      _Engine.apply(this, arguments);
    }
  }

  _inherits(Trek, _Engine);

  _createClass(Trek, null, {
    env: {

      /**
       * Returns the current Trek environment.
       *
       * @example
       *  Trek.env
       *  // => development | production | test
       *
       * @static
       * @public
       * @default 'development'
       * @return {String}
       */

      get: function () {
        return this._env || (this._env = process.env.TREK_ENV || process.env.IOJS_ENV || process.env.NODE_ENV || "development");
      }
    },
    isProduction: {

      /**
       * Returns true if current environment is `production`.
       *
       * @static
       * @public
       * @return {Boolean}
       */

      get: function () {
        return this.env === "production";
      }
    },
    isDevelopment: {

      /**
       * Returns true if current environment is `development`.
       *
       * @static
       * @public
       * @return {Boolean}
       */

      get: function () {
        return this.env === "development";
      }
    },
    isTest: {

      /**
       * Returns true if current environment is `test`.
       *
       * @static
       * @return {Boolean}
       * @public
       */

      get: function () {
        return this.env === "test";
      }
    },
    "package": {

      /**
       * Returns Trek package information.
       *
       * @static
       * @public
       * @return {Object}
       */

      get: function () {
        return require("../package.json");
      }
    },
    version: {

      /**
       * Returns Trek current version.
       *
       * @static
       * @public
       * @return {String}
       */

      get: function () {
        return this["package"].version;
      }
    },
    keys: {

      /**
       * Trek app `keys`.
       *
       * @static
       * @public
       * @return {Array}
       */

      get: function () {
        return TREK_KEYS;
      }
    },
    King: {

      /**
       * Trekking utility tools.
       *
       * @static
       * @public
       * @return {Object}
       */

      get: function () {
        return require("./king");
      }
    }
  });

  return Trek;
})(Engine);

/**
 * Puts `Trek` to the global.
 *
 * @global
 * @public
 * @return {Trek}
 */
if (!global.Trek) {
  global.Trek = Trek;

  /**
   * Delegate getter to `Trek.King`.
   */
  delegate(Trek, "King").getter("_").getter("joi").getter("jwt").getter("uuid").getter("bcrypt").getter("pbkdf2").getter("logger").getter("validator").getter("dotenv").getter("debug").getter("Mailer").getter("RouteMapper");
}

module.exports = global.Trek;