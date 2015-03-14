"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = _interopRequire(require("path"));

var chalk = _interopRequire(require("chalk"));

var has = _interopRequire(require("lodash-node/modern/object/has"));

var co = _interopRequire(require("co"));

var _debug = _interopRequire(require("debug"));

var winston = _interopRequire(require("winston"));

var jsonwebtoken = _interopRequire(require("jsonwebtoken"));

var nodemailer = _interopRequire(require("nodemailer"));

var Koa = _interopRequire(require("koa"));

//import RouteMapper from 'route-mapper';

var Config = _interopRequire(require("./config"));

var extraContext = _interopRequire(require("./context"));

var defaultStack = require("./stack").defaultStack;

const debug = _debug("trek");

/**
 * @class Trek
 */

let Trek = (function (_Koa) {

  /**
   * Initialize a new `Trek` app with a working `root` directory.
   *
   * @constructor
   * @param {String} root
   */

  function Trek(root) {
    _classCallCheck(this, Trek);

    if (root) this.root = root;

    this.logger.debug(chalk.green("* Trek application starts from %s"), this.root);

    _Koa.call(this);

    this.env = Trek.env;
    this.initialize();
  }

  _inherits(Trek, _Koa);

  /**
   * @api private
   */

  Trek.prototype.initialize = function initialize() {
    this.config.initialize();
    extraContext(this.context);
    defaultStack(this);
  };

  /**
   * Trek app `sendMail`.
   *
   * @method
   * @param {Object}
   * @param {Callback}
   * @api public
   */

  Trek.prototype.sendMail = function sendMail(data, done) {
    this.mailer.sendMail(data, done);
  };

  /**
   * Runs Trek app.
   *
   * @method
   * @return {Promise}
   * @api public
   */

  Trek.prototype.run = function run() {
    var _this = this;

    var _arguments = arguments;

    let self = this;
    self.logger.info(chalk.green("* Trek booting ..."));
    let config = self.config;
    let servicesPath = self.paths.get("app/services").path;
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
          self.logger.info(chalk.green(`* Trek service:${ name } init ...`));
          if (service.promise) yield service.promise;
          self.logger.info(chalk.green(`* Trek service:${ name } booted`));
        }
      }
    }).then(function () {
      var _ref;

      // TODO: https
      let args = [].concat(_slice.call(_arguments));
      if (!args[0]) args[0] = _this.config.get("site.port");
      let app = (_ref = _this).listen.apply(_ref, args);
      _this.logger.info(chalk.green("* Trek %s application starting in %s on http://%s:%s"), Trek.version, Trek.env, app.address().address === "::" ? "127.0.0.1" : app.address().address, app.address().port);
    })["catch"](function (e) {
      _this.logger.error(chalk.bold.red(`${ e }`));
      _this.logger.error(chalk.red("* Trek boots failed."));
    });
  };

  Trek.prototype.getService = function getService(key) {
    return this.services.get(key);
  };

  Trek.prototype.setService = function setService(key, value) {
    this.logger.log("info", chalk.yellow("* Trek service:%s"), key);
    this.services.set(key, value);
  };

  _createClass(Trek, {
    root: {

      /**
       * Returns `Trek` app working `root` directory.
       *
       * @getter
       * @property
       * @return {String}
       * @api public
       */

      get: function () {
        return this._root || (this._root = path.dirname(require.main.filename));
      },

      /**
       * Sets a working `root` directory for `Trek` app.
       *
       * @setter
       * @property
       * @api public
       */
      set: function (root) {
        this._root = root;
      }
    },
    config: {

      /**
       * Returns `Trek` app `config`.
       *
       * @getter
       * @property
       * @return {Mixed}
       * @api public
       */

      get: function () {
        return this._config || (this._config = new Config(this.root));
      },

      /**
       * Sets `config` for `Trek` app.
       *
       * @setter
       * @property
       * @api public
       */
      set: function (config) {
        this._config = config;
      }
    },
    paths: {

      /**
       * Gets paths.
       *
       * @getter
       * @property
       * @return {Mixed}
       * @api public
       */

      get: function () {
        return this.config.paths;
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
            level: "debug",
            prettyPrint: true,
            colorize: true,
            timestamp: true
          })]
        }));
      }
    },
    mailer: {

      /**
       * Trek app `mailer`.
       *
       * @getter
       * @property
       * @return {Object}
       * @api public
       */

      get: function () {
        var _this = this;

        return this._mailer || (function () {
          let transport = _this.config.get("mailer.transport");
          let options = _this.config.get("mailer.options");
          let moduleName = `nodemailer-${ transport }-transport`;
          let transporter;
          if (transport) {
            try {
              transporter = require(moduleName);
            } catch (e) {
              _this.app.logger.error(chalk.bold.red(`Missing ${ moduleName }.`));
            }
          }
          return _this._mailer = nodemailer.createTransport(transport ? transporter(options) : options);
        })();
      }
    },
    jwt: {

      /**
       * Trek app `jwt`.
       *
       * @getter
       * @property
       * @param {Object}
       * @api public
       */

      get: function () {
        var _this = this;

        return this._jwt || (function () {
          return _this._jwt = jsonwebtoken;
        })();
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
  }, {
    env: {

      /**
       * Returns the current Trek environment.
       *
       *  ```
       *  Trek.env // => development | production | test
       *  ```
       *
       * @property env
       * @default 'development'
       * @static
       */

      get: function () {
        return this._env || (process.env.TREK_ENV || process.env.NODE_ENV || process.env.IOJS_ENV || "development");
      }
    },
    "package": {

      /**
       * Returns Trek package informations.
       *
       * @property package
       * @return {Object}
       * @static
       */

      get: function () {
        return this._package || (this._package = require(path.join(__dirname, "../package.json")));
      }
    },
    version: {

      /**
       * Returns Trek current version.
       *
       * @property version
       * @return {String}
       * @static
       */

      get: function () {
        return this["package"].version;
      }
    }
  });

  return Trek;
})(Koa);

if (!has(global, "Trek")) global.Trek = Trek;

module.exports = global.Trek;