"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _hasOwn = Object.prototype.hasOwnProperty;
var path = _interopRequire(require("path"));

var Root = require("./paths").Root;
var _configuration = require("./configuration");

var MiddlewareStackProxy = _configuration.MiddlewareStackProxy;
var Generators = _configuration.Generators;
var _trekking = require("./trekking");

var Trekking = _trekking.Trekking;
var TrekkingConfiguration = _trekking.Configuration;
var Configuration = (function (TrekkingConfiguration) {
  function Configuration() {
    var root = arguments[0] === undefined ? null : arguments[0];
    _get(Object.getPrototypeOf(Configuration.prototype), "constructor", this).call(this);
    //this._root = root;
    //// copy
    //this._generators = Object.create(this.appGenerators);
  }

  _inherits(Configuration, TrekkingConfiguration);

  _prototypeProperties(Configuration, null, {
    middleware: {
      get: function () {
        return this._middleware || (this._middleware = new MiddlewareStackProxy());
      },
      configurable: true
    },
    generators: {
      value: function generators(cb) {
        this._generators || (this._generators = new Generators());
        if (cb) {
          cb(this._generators);
        }
        return this._generators;
      },
      writable: true,
      configurable: true
    },
    paths: {
      get: function () {
        return this._paths || (this._paths = generatePaths(this._root));
      },
      configurable: true
    },
    root: {
      get: function () {
        return this._root;
      },
      set: function (value) {
        return this._root = this.paths.path = path.resolve(value);
      },
      configurable: true
    }
  });

  return Configuration;
})(TrekkingConfiguration);

var generatePaths = function (root) {
  var paths = new Root(root);

  paths.add("app");
  paths.add("app/controllers");
  paths.add("app/helpers");
  paths.add("app/models");
  paths.add("app/mailers");
  paths.add("app/views");

  paths.add("lib");
  paths.add("lib/tasks", { glob: "**/*.gulp.js" });

  paths.add("config");
  paths.add("config/environments", { glob: "" + Trek.env + ".js" });
  paths.add("config/locales", { glob: "*.{js,yml}" });
  paths.add("config/routes.js");

  return paths;
};



var MiddlewareStack = function MiddlewareStack() {};

var Engine = (function (Trekking) {
  function Engine() {
    this._app = null;
    this._config = null;
    this._envConfig = null;
    this._helpers = null;
    this._routes = null;
    _get(Object.getPrototypeOf(Engine.prototype), "constructor", this).call(this);
  }

  _inherits(Engine, Trekking);

  _prototypeProperties(Engine, {
    find: {
      value: function find(path) {},
      writable: true,
      configurable: true
    },
    findRoot: {
      value: function findRoot(from) {},
      writable: true,
      configurable: true
    },
    findRootWithFlag: {
      value: function findRootWithFlag(flag, from, _default) {},
      writable: true,
      configurable: true
    }
  }, {
    config: {
      get: function () {
        return this._config || (this._config = new Configuration());
      },
      configurable: true
    },
    middleware: {
      get: function () {
        return this.config.middleware;
      },
      configurable: true
    },
    root: {
      get: function () {
        return this.config.root;
      },
      configurable: true
    },
    paths: {
      get: function () {
        return this.config.paths;
      },
      configurable: true
    },
    routes: {
      get: function () {
        //this._routes ? =
        return this._routes;
      },
      configurable: true
    },
    envConfig: {
      get: function () {
        return this._envConfig || (this._envConfig = Object.create({
          routes: this.routes
        }));
      },
      configurable: true
    },
    app: {
      get: function () {},
      configurable: true
    },
    endpoint: {
      value: function endpoint(endpoint) {
        var _ref = this;
        if (!_hasOwn.call(_ref, "_endpoint")) _ref._endpoint = null;
        if (endpoint) this._endpoint = endpoint;
        return this._endpoint;
      },
      writable: true,
      configurable: true
    },
    run: {
      value: function run(env) {},
      writable: true,
      configurable: true
    },
    defaultMiddlewareStack: {
      get: function () {
        return new MiddlewareStack();
      },
      configurable: true
    }
  });

  return Engine;
})(Trekking);

exports.Engine = Engine;
exports.Configuration = Configuration;
exports.__esModule = true;
//this._app ?=
//this.app.call(env);