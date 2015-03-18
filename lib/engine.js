"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*!
 * trek/engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = _interopRequire(require("path"));

var chalk = _interopRequire(require("chalk"));

var co = _interopRequire(require("co"));

var Koa = _interopRequire(require("koa"));

var mount = _interopRequire(require("koa-mount"));

//import RouteMapper from 'route-mapper';

var Config = _interopRequire(require("./config"));

var extraContext = _interopRequire(require("./context"));

var defaultStack = _interopRequire(require("./stack"));

/**
 * @class Engine
 * @public
 */

let Engine = (function (_Koa) {

  /**
   * Initialize a new app with a working `root` directory.
   *
   * @constructor Engine
   * @param {String} root
   */

  function Engine(root) {
    _classCallCheck(this, Engine);

    if (root) this.root = root;

    this.logger.debug("Application starts from %s.", chalk.green(this.root));

    _Koa.call(this);

    this.initialize();
  }

  _inherits(Engine, _Koa);

  /**
   * @constructs
   * @private
   */

  Engine.prototype.initialize = function initialize() {
    this.dotenv();
    this.config.initialize();
    extraContext(this.context);
    defaultStack(this);
  };

  /**
   * Loads environment variables from .env for app.
   *
   * @memberof Engine
   * @method
   * @public
   */

  Engine.prototype.dotenv = function dotenv() {
    let loaded = Trek.dotenv.config({
      path: `${ this.root }/.env`
    });
    if (!loaded) this.logger.debug("Missing %s.", chalk.red(".env"));
    loaded = Trek.dotenv.config({
      path: `${ this.root }/.env.${ Trek.env }`
    });
    if (!loaded) this.logger.debug("Missing %s.", chalk.red(`.env.${ Trek.env }`));
  };

  /**
   * Trek app `sendMail`.
   *
   *  ```
   *  let result = yield app.sendMail(message);
   *  ```
   *
   * @method
   * @public
   * @param {Object}
   * @param {Promise}
   */

  Engine.prototype.sendMail = function sendMail(data) {
    return this.mailer.send(data);
  };

  /**
   * Mount `app` with `prefix`, `app`
   * may be a Trek application or
   * middleware function.
   *
   * @method
   * @public
   * @param {String|Application|Function} prefix, app, or function
   * @param {Application|Function} [app or function]
   */

  Engine.prototype.mount = (function (_mount) {
    var _mountWrapper = function mount() {
      return _mount.apply(this, arguments);
    };

    _mountWrapper.toString = function () {
      return _mount.toString();
    };

    return _mountWrapper;
  })(function () {
    return this.use(mount.apply(undefined, arguments));
  });

  /**
   * Runs app.
   *
   * @method
   * @public
   * @return {Promise}
   */

  Engine.prototype.run = function run() {
    var _this = this;

    var _arguments = arguments;

    let self = this;
    self.logger.info(chalk.green("booting ..."));
    let config = self.config;
    let servicesPath = self.paths.get("app/services").path;
    this.keys = config.secrets.secretKeyBase;
    return co(function* () {
      let seq = [];
      let files = self.paths.get("app/services").existent;
      for (var _iterator = files, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        let file = _ref;

        let name = path.basename(file, ".js").replace(/^[0-9]+-/, "");
        let service = require(file)(self, config);
        if (service) {
          self.setService(name, service);
          self.logger.info(chalk.green(`service:${ name } init ...`));
          if (service.promise) yield service.promise;
          self.logger.info(chalk.green(`service:${ name } booted`));
        }
      }
    }).then(function () {
      // TODO: https
      let args = [].concat(_slice.call(_arguments));
      if (!args[0]) args[0] = _this.config.get("site.port");
      let app = _this.listen.apply(_this, args);
      _this.logger.info(chalk.green("%s application starting in %s on http://%s:%s"), Trek.version, Trek.env, app.address().address === "::" ? "127.0.0.1" : app.address().address, app.address().port);
      _this._httpServer = app;
    })["catch"](function (e) {
      _this.logger.error(chalk.bold.red(`${ e }`));
      _this.logger.error(chalk.red("boots failed."));
    });
  };

  Engine.prototype.getService = function getService(key) {
    return this.services.get(key);
  };

  Engine.prototype.setService = function setService(key, value) {
    this.logger.log("info", chalk.yellow("service:%s"), key);
    this.services.set(key, value);
  };

  _createClass(Engine, {
    root: {

      /**
       * Returns app working `root` directory.
       *
       * @public
       * @return {String}
       */

      get: function () {
        return this._root || (this._root = path.dirname(require.main.filename));
      },

      /**
       * Sets a working `root` directory for app.
       *
       * @param {Root}
       * @public
       */
      set: function (root) {
        this._root = root;
      }
    },
    name: {

      /**
       * Gets current app name.
       * Defaults to `Trek`.
       *
       * @public
       * @return {String}
       */

      get: function () {
        return this._name || (this._name = this.config.get("name") || "Trek");
      },

      /**
       * Sets current app name.
       *
       * @public
       * @param {String}
       */
      set: function (name) {
        this._name = name;
      }
    },
    config: {

      /**
       * Returns app `config`.
       *
       * @public
       * @return {Mixed}
       */

      get: function () {
        return this._config || (this._config = new Config(this));
      },

      /**
       * Sets `config` for  app.
       *
       * @public
       */
      set: function (config) {
        this._config = config;
      }
    },
    paths: {

      /**
       * Gets paths.
       *
       * @public
       * @return {Root}
       */

      get: function () {
        return this.config.paths;
      }
    },
    logger: {

      /**
       * Trek app `logger`.
       *
       * @public
       * @return {winston.Logger}
       */

      get: function () {
        return this._logger || (this._logger = Object.create(Trek.logger));
      }
    },
    mailer: {

      /**
       * Trek app `mailer`.
       *
       * @public
       * @return {Mailer}
       */

      get: function () {
        return this._mailer || (this._mailer = new Trek.Mailer(this.config.get("mail")));
      }
    },
    cache: {

      /*
      get routeMapper() {
        return this._routeMapper || (this._routeMapper = new RouteMapper);
      }
      */

      get: function () {
        return this._cache || (this._cache = new Map());
      }
    },
    services: {
      get: function () {
        return this._services || (this._services = new Map());
      }
    }
  });

  return Engine;
})(Koa);

module.exports = Engine;