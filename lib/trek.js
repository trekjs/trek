"use strict";

var _global;

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;
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

    _get(Object.getPrototypeOf(Trek.prototype), "constructor", this).call(this);

    this.env = Trek.env;
    this.initialize();
  }

  _inherits(Trek, _Koa);

  _createClass(Trek, {
    calledFrom: {
      get: function () {
        return this._calledFrom || (this._calledFrom = path.dirname(require.main.filename));
      },
      set: function (path) {
        this._calledFrom = path;
      }
    },
    findRoot: {
      value: function findRoot(from) {
        return this.findRootWithFlag("lib", from);
      }
    },
    findRootWithFlag: {
      value: function findRootWithFlag(flag, rootPath, _default) {
        if (rootPath) {
          while (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory() && !fs.existsSync(`${ rootPath }/${ flag }`)) {
            let parent = path.dirname(rootPath);
            rootPath = parent !== rootPath && parent;
          }
        }

        let root = fs.existsSync(`${ rootPath }/${ flag }`) ? rootPath : _default;
        if (!root) {
          throw new Error(`Could not find root path for ${ this }`);
        }

        return fs.realpathSync(root);
      }
    },
    initialize: {
      value: function initialize() {
        this.config.load(this.paths.get("config/application").first);
        this.config.load(this.paths.get("config/environments").first);
        extraContext(this.context);
        defaultStack(this);
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
    run: {
      value: function run() {
        var _ref;

        // TODO: https
        (_ref = this).listen.apply(_ref, arguments);
      }
    }
  }, {
    env: {
      get: function () {
        var _ref;

        return (_ref = this, !_hasOwn.call(_ref, "_env") && (_ref._env = process.env.TREK_ENV || process.env.IOJS_ENV || process.env.NODE_ENV || "development"), _ref._env);
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

module.exports = (_global = global, !_hasOwn.call(_global, "Trek") && (_global.Trek = Trek), _global.Trek);