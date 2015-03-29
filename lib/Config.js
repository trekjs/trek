/*!
 * trek - lib/Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var path = _interopRequire(require("path"));

var EventEmitter = require("events").EventEmitter;

var _lodashNodeModernLang = require("lodash-node/modern/lang");

var cloneDeep = _lodashNodeModernLang.cloneDeep;
var isPlainObject = _lodashNodeModernLang.isPlainObject;

var _lodashNodeModernObject = require("lodash-node/modern/object");

var defaults = _lodashNodeModernObject.defaults;
var has = _lodashNodeModernObject.has;

var chalk = _interopRequire(require("chalk"));

var _utils = require("./utils");

var valueForKeyPath = _utils.valueForKeyPath;
var setValueForKeyPath = _utils.setValueForKeyPath;
var hasKeyPath = _utils.hasKeyPath;

var Root = _interopRequire(require("./paths"));

/**
 * @class Config
 * @public
 */

let Config = (function () {

  /**
   * Initialize an app's config.
   *
   * @constructor
   * @param {Trek} app
   */

  function Config(app) {
    _classCallCheck(this, Config);

    this.app = app;
    this.root = app.root;
    this.emitter = new EventEmitter();
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  /**
   * @private
   */

  Config.prototype.initialize = function initialize() {
    this.dotenv();
    this.load(this.paths.get("config/application").first);
    this.load(this.paths.get("config/environments").first);
  };

  /**
   * Loads a config file.
   *
   * @method
   * @public
   * @param {String} filepath
   */

  Config.prototype.load = function load(filepath) {
    try {
      require(filepath)(this);
    } catch (e) {
      Trek.logger.warn(`${ e }`);
    }
    Trek.logger.debug("Loaded %s.", chalk.green(path.relative(this.root, filepath)));
  };

  /**
   * Loads environment variables from .env for app.
   *
   * @method dotenv
   * @public
   */

  Config.prototype.dotenv = function dotenv() {
    var _this = this;

    [".env", `.env.${ Trek.env }`].forEach(function (env) {
      let loaded = Trek.dotenv.config({
        path: `${ _this.root }/config/${ env }`
      });
      if (!loaded) Trek.logger.debug("Missing %s.", chalk.red(env));else Trek.logger.debug("Loaded %s.", chalk.green(env));
    });
  };

  /**
   * Gets value with `keyPath`.
   *
   * @example
   *  let site = config.get('site')
   *  let sietUrl = config.get('site.url')
   *  let name = config.get('name', true)
   *  ```
   *
   * @method
   * @public
   * @param {String} keyPath
   * @param {Boolean} isDefault [optional]
   * @return {Mixed}
   */

  Config.prototype.get = function get(keyPath) {
    let isDefault = arguments[1] === undefined ? false : arguments[1];

    let value, defaultValue;
    defaultValue = valueForKeyPath(this.defaultSettings, keyPath);
    if (!isDefault) value = valueForKeyPath(this.settings, keyPath);

    if (value) {
      value = cloneDeep(value);
      if (isPlainObject(value) && isPlainObject(defaultValue)) {
        defaults(value, defaultValue);
      }
    } else {
      value = cloneDeep(defaultValue);
    }

    return value;
  };

  /**
   * Sets value with a keyPath.
   *
   * @example
   *  config.set('site', {
   *    url: 'http://trekjs.com',
   *    title: 'TREK.JS'
   *  }, true)
   *
   * @method
   * @public
   * @param {String} keyPath
   * @param {Mixed} value
   * @param {Boolean} isDefault [optional]
   * @return {Mixed}
   */

  Config.prototype.set = function set(keyPath, value, isDefault) {
    setValueForKeyPath(isDefault ? this.defaultSettings : this.settings, keyPath, value);
  };

  _createClass(Config, {
    env: {

      /**
       * Delegates `process.env`.
       *
       * @public
       * @return {Object}
       */

      get: function () {
        return process.env;
      }
    },
    paths: {

      /**
       * Gets app's `paths`.
       *
       * @public
       * @return {Root}
       */

      get: function () {
        return this._paths || (this._paths = (function (root) {
          let paths = new Root(root);

          paths.add("app");
          paths.add("app/controllers");
          paths.add("app/models", { glob: "*.js" });
          paths.add("app/services", { glob: "*.js" });
          paths.add("app/views");

          paths.add("lib");

          paths.add("config");
          paths.add("config/application", { "with": "config/application.js" });
          paths.add("config/environments", { glob: `${ Trek.env }.js` });
          paths.add("config/locales", { glob: "*.{js,json}" });

          paths.add("config/database", { "with": "config/database.js" });
          paths.add("config/secrets", { "with": "config/secrets.js" });
          paths.add("config/session", { "with": "config/session.js" });
          paths.add("config/routes", { "with": "config/routes.js" });
          paths.add("config/middleware", { "with": "config/middleware.js" });
          paths.add("config/global.js", { "with": "config/global.js" });

          paths.add("log", { "with": `log/${ Trek.env }.log` });
          paths.add("public");
          paths.add("tmp");

          return paths;
        })(this.root));
      }
    },
    secrets: {

      /**
       * Gets the secrets settings.
       *
       * @public
       * @return {Object}
       */

      get: function () {
        var _this = this;

        return this._secrets || (this._secrets = (function () {
          let allSecrets = {};
          let filepath = _this.paths.get("config/secrets").first;
          try {
            allSecrets = require(filepath);
          } catch (e) {
            Trek.logger.warn(`Missing %s.`, chalk.red(filepath));
          }
          let secrets = allSecrets[Trek.env] || {};
          if (!secrets.secretKeyBase) {
            secrets.secretKeyBase = Trek.keys;
          }
          return secrets;
        })());
      }
    },
    session: {

      /**
       * Gets the session settings.
       *
       * @public
       * @return {Object}
       */

      get: function () {
        let allSession = {};
        let filepath = this.paths.get("config/session").first;
        try {
          allSession = require(filepath);
        } catch (e) {
          Trek.logger.warn(`Missing %s.`, chalk.red(filepath));
        }
        let session = allSession[Trek.env] || {};
        return session;
      }
    },
    publicPath: {

      /**
       * Gets the app public path.
       *
       * @public
       * @return {String}
       */

      get: function () {
        return this.paths.get("public").first;
      }
    },
    viewsPath: {

      /**
       * Gets the app views path.
       *
       * @public
       * @return {String}
       */

      get: function () {
        return this.paths.get("app/views").first;
      }
    }
  });

  return Config;
})();

module.exports = Config;