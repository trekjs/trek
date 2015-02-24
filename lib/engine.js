"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var Koa = _interopRequire(require("koa"));

var isObject = _interopRequire(require("lodash-node/modern/lang/isObject"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var Root = require("./paths").Root;

var MiddlewareStack = require("./stack").MiddlewareStack;

var _configuration = require("./configuration");

var MiddlewareStackProxy = _configuration.MiddlewareStackProxy;
var Generators = _configuration.Generators;

var _trekking = require("./trekking");

var Trekking = _trekking.Trekking;
var TrekkingConfiguration = _trekking.Configuration;

var Configuration = (function (TrekkingConfiguration) {
  function Configuration() {
    var root = arguments[0] === undefined ? null : arguments[0];

    _classCallCheck(this, Configuration);

    _get(Object.getPrototypeOf(Configuration.prototype), "constructor", this).call(this);
    this._root = root;
    // copy from `appGenerators`
    this._generators = Object.create(this.appGenerators);
  }

  _inherits(Configuration, TrekkingConfiguration);

  _prototypeProperties(Configuration, null, {
    middleware: {
      get: function () {
        return this._middleware || (this._middleware = new MiddlewareStackProxy());
      },
      set: function (middleware) {
        this._middleware = middleware;
      },
      configurable: true
    },
    generators: {
      value: function generators(cb) {
        var _ref = this;

        if (!_hasOwn.call(_ref, "_generators")) _ref._generators = new Generators();

        if (isFunction(cb)) cb(this._generators);
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
  paths.add("config/environments", { glob: `${ Trek.env }.js` });
  paths.add("config/locales", { glob: "*.{js,yml}" });
  paths.add("config/routes.js");

  return paths;
};

var Engine = (function (Trekking) {
  function Engine() {
    _classCallCheck(this, Engine);

    this._app = null;
    this._config = null;
    this._envConfig = null;
    this._helpers = null;
    this._routes = null;
    _get(Object.getPrototypeOf(Engine.prototype), "constructor", this).call(this);
  }

  _inherits(Engine, Trekking);

  _prototypeProperties(Engine, null, {
    calledFrom: {
      get: function () {
        return process.cwd();
      },
      configurable: true
    },
    find: {
      value: function find(path) {
        return path = path.resolve(path);
      },
      writable: true,
      configurable: true
    },
    findRoot: {
      value: function findRoot(from) {
        return this.findRootWithFlag("lib", from);
      },
      writable: true,
      configurable: true
    },
    findRootWithFlag: {
      value: function findRootWithFlag(flag, rootPath, _default) {
        if (rootPath) {
          while (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory() && !fs.existsSync(`${ rootPath }/${ flag }`)) {
            var _parent = path.dirname(rootPath);
            rootPath = _parent !== rootPath && _parent;
          }
        }

        var root = fs.existsSync(`${ rootPath }/${ flag }`) ? rootPath : _default;
        if (!root) {
          throw new Error(`Could not find root path for ${ this }`);
        }

        return fs.realpathSync(root);
      },
      writable: true,
      configurable: true
    },
    config: {
      get: function () {
        return this._config || (this._config = new Configuration(this.findRoot(this.calledFrom)));
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
    helpersPaths: {

      // Returns all registered helpers paths.

      get: function () {
        return this.paths.get("app/helpers").existent;
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
        return this._envConfig || (this._envConfig = {
          routes: this.routes
        });
      },
      configurable: true
    },
    app: {

      // Returns the underlying koa application for this engine.

      get: function () {
        var _this = this;

        return this._app || (this._app = (function () {
          var app = new Koa();
          app.env = Trek.env;
          _this.config.middleware = _this.config.middleware.mergeInto(_this.defaultMiddlewareStack);
          app.use(_this.config.middleware.build(app));
          return app;
        })());
      },
      configurable: true
    },
    endpoint: {
      get: function () {
        var _ref;

        return (_ref = this, !_hasOwn.call(_ref, "_endpoint") && (_ref._endpoint = new Koa()), _ref._endpoint);
      },
      set: function (endpoint) {
        return this._endpoint = endpoint;
      },
      configurable: true
    },
    run: {

      // callback or call, run

      value: function run() {
        var env = arguments[0] === undefined ? {} : arguments[0];

        if (isObject(env)) env = Object.assign(env, this.envConfig);
        this.app.listen(env.port || 3000);
      },
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
Object.defineProperty(exports, "__esModule", {
  value: true
});