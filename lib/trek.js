"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var has = _interopRequire(require("lodash-node/modern/object/has"));

var chalk = _interopRequire(require("chalk"));

var winston = _interopRequire(require("winston"));

var Engine = _interopRequire(require("./engine"));

const TREK_KEYS = ["Star Trek", "EnterPrise", "Spock"];

/**
 * @class Trek
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
       *  ```
       *  Trek.env // => development | production | test
       *  ```
       *
       * @static
       * @property env
       * @default 'development'
       * @return {String}
       * @api public
       */

      get: function () {
        return this._env || (process.env.TREK_ENV || process.env.NODE_ENV || process.env.IOJS_ENV || "development");
      }
    },
    isProduction: {

      /**
       * Returns true if current environment is `production`.
       *
       * @static
       * @property isProduction
       * @return {Boolean}
       * @api public
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
       * @property isDevelopment
       * @return {Boolean}
       * @api public
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
       * @property isTest
       * @return {Boolean}
       * @api public
       */

      get: function () {
        return this.env === "test";
      }
    },
    "package": {

      /**
       * Returns Trek package informations.
       *
       * @static
       * @property package
       * @return {Object}
       * @api public
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
       * @property version
       * @return {String}
       * @api public
       */

      get: function () {
        return this["package"].version;
      }
    },
    logger: {

      /**
       * Trek app `logger`.
       *
       * @getter
       * @property
       * @return {Object}
       * @api public
       */

      get: function () {
        return this._logger || (this._logger = new winston.Logger({
          transports: [new winston.transports.Console({
            label: chalk.green("Trek"),
            prettyPrint: true,
            colorize: true,
            level: Trek.env === "production" ? "info" : "debug"
            //timestamp: true
          })]
        }));
      }
    },
    keys: {

      /**
       * Trek app `keys`.
       *
       * @getter
       * @property
       * @return {Array}
       * @api public
       */

      get: function () {
        return TREK_KEYS;
      }
    }
  });

  return Trek;
})(Engine);

/**
 * Puts `Trek` to the global.
 *
 * @static
 * @property Trek
 * @return {Mixed}
 * @api public
 */
if (!has(global, "Trek")) global.Trek = Trek;

module.exports = global.Trek;