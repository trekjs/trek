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

/**
 * Module dependencies.
 */

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var has = _interopRequire(require("lodash-node/modern/object/has"));

var chalk = _interopRequire(require("chalk"));

var Promise = _interopRequire(require("bluebird"));

var winston = _interopRequire(require("winston"));

var Koa = _interopRequire(require("koa"));

var _debug = _interopRequire(require("debug"));

var RouteMapper = _interopRequire(require("route-mapper"));

var Config = _interopRequire(require("./config"));

var extraContext = _interopRequire(require("./context"));

var defaultStack = require("./stack").defaultStack;

const debug = _debug("trek");

let Trek = (function (_Koa) {
  function Trek(calledFrom) {
    _classCallCheck(this, Trek);

    this.calledFrom = calledFrom;

    debug("init %s", this.calledFrom);

    _Koa.call(this);

    this.env = Trek.env;
    this.initialize();
  }

  _inherits(Trek, _Koa);

  Trek.prototype.findRoot = function findRoot(from) {
    return this.findRootWithFlag("lib", from);
  };

  Trek.prototype.findRootWithFlag = function findRootWithFlag(flag, rootPath, _default) {
    if (rootPath) {
      while (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory() && !fs.existsSync(`${ rootPath }/${ flag }`)) {
        let parent = path.dirname(rootPath);
        rootPath = parent !== rootPath && parent;
      }
    }

    let root = fs.existsSync(`${ rootPath }/${ flag }`) ? rootPath : _default;
    if (!root) {
      this.logger.error(` * Could not find root path for ${ this }`);
    }

    return fs.realpathSync(root);
  };

  Trek.prototype.initialize = function initialize() {
    this.config.initialize();
    extraContext(this.context);
    defaultStack(this);
  };

  Trek.prototype.getService = function getService(key) {
    return this.services.get(key);
  };

  Trek.prototype.setService = function setService(key, value) {
    this.logger.log("info", chalk.yellow("* Service: %s"), key);
    this.services.set(key, value);
  };

  Trek.prototype.run = function run() {
    var _this = this;

    var _arguments = arguments;

    let arr = [];

    this.services.forEach(function (value, key) {
      if (value.promise) {
        arr.push(value.promise);
      }
    });

    let booted = false;
    return Promise.some(arr, arr.length).then(function () {
      var _ref;

      // TODO: https
      let app = (_ref = _this).listen.apply(_ref, _arguments);
      _this.logger.info(chalk.green(" * Trek %s application starting in %s on http://%s:%s"), Trek.version, Trek.env, app.address().address === "::" ? "localhost" : app.address().address, app.address().port);
      booted = true;
    })["catch"](Promise.AggregateError, function (errors) {
      errors.forEach(function (e) {
        _this.logger.error(chalk.bold.red(`${ e }`));
      });
      booted = false;
    })["finally"](function () {
      if (!booted) {
        _this.logger.error(chalk.red(" * Trek boots failed."));
      }
    });
  };

  _createClass(Trek, {
    calledFrom: {
      get: function () {
        return this._calledFrom || (this._calledFrom = path.dirname(require.main.filename));
      },
      set: function (path) {
        this._calledFrom = path;
      }
    },
    config: {
      get: function () {
        return this._config || (this._config = new Config(this.findRoot(this.calledFrom)));
      },
      set: function (config) {
        this._config = config;
      }
    },
    root: {
      get: function () {
        return this.config.root;
      }
    },
    paths: {
      get: function () {
        return this.config.paths;
      }
    },
    routeMapper: {
      get: function () {
        return this._routeMapper || (this._routeMapper = new RouteMapper());
      }
    },
    services: {
      get: function () {
        return this._services || (this._services = new Map());
      }
    },
    logger: {
      get: function () {
        return this._logger || (this._logger = new winston.Logger({
          transports: [new winston.transports.Console({
            //prettyPrint: true,
            colorize: true,
            timestamp: true
          })]
        }));
      }
    }
  }, {
    env: {
      get: function () {
        return this._env || (process.env.TREK_ENV || process.env.IOJS_ENV || process.env.NODE_ENV || "development");
      }
    },
    "package": {
      get: function () {
        return this._package || (this._package = require("../package"));
      }
    },
    version: {
      get: function () {
        return this["package"].version;
      }
    }
  });

  return Trek;
})(Koa);

if (!has(global, "Trek")) global.Trek = Trek;

module.exports = global.Trek;