"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _hasOwn = Object.prototype.hasOwnProperty;
var koaLoadMiddlewares = _interopRequire(require("koa-load-middlewares"));

var MiddlewareStack = require("./stack").MiddlewareStack;
var _engine = require("./engine");

var Engine = _engine.Engine;
var EngineConfiguration = _engine.Configuration;
var DefaultMiddlewareStack = (function () {
  function DefaultMiddlewareStack(app, config, paths) {
    this._app = app;
    this._config = config;
    this._paths = paths;
  }

  _prototypeProperties(DefaultMiddlewareStack, null, {
    app: {
      get: function () {
        return this._app;
      },
      configurable: true
    },
    config: {
      get: function () {
        return this._config;
      },
      configurable: true
    },
    paths: {
      get: function () {
        return this._paths;
      },
      configurable: true
    },
    buildStack: {
      value: function buildStack() {
        return new MiddlewareStack(function (middleware) {
          var ms = koaLoadMiddlewares();
          middleware.use(ms.responseTime());
          middleware.use(ms.methodoverride());
          middleware.use(ms.xRequestId(null, true));

          // add logger
          // add remoteIp
          // add cookies
          // add session

          middleware.use(ms.bodyparser());
        });
      },
      writable: true,
      configurable: true
    }
  });

  return DefaultMiddlewareStack;
})();

var Configuration = (function (EngineConfiguration) {
  function Configuration() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(Configuration.prototype), "constructor", this).apply(this, args);
    this._sessionStore = "cookieStore";
    this._sessionOptions = Object.create(null);
    this._timeZone = "UTC";
    this._logLevel = null;
    this._middleware = this.appMiddleware;
    this._generators = this.appGenerators;
  }

  _inherits(Configuration, EngineConfiguration);

  _prototypeProperties(Configuration, null, {
    paths: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_paths") && (_ref._paths = (function (paths) {
          paths.add("config/database", { "with": "config/database.json" });
          paths.add("config/secrets", { "with": "config/secrets.json" });
          paths.add("config/environment", { "with": "config/environment.json" });
          paths.add("log", { "with": "log/" + Trek.env + ".log" });
          paths.add("public");
          paths.add("tmp");
          return paths;
        })(_get(Object.getPrototypeOf(Configuration.prototype), "paths", this))), _ref._paths);
      },
      configurable: true
    },
    databaseConfiguration: {
      get: function () {},
      configurable: true
    },
    logLevel: {
      get: function () {
        var _ref;
        return (_ref = this, !_hasOwn.call(_ref, "_logLevel") && (_ref._logLevel = Trek.env === "production" ? "inof" : "debug"), _ref._logLevel);
      },
      configurable: true
    }
  });

  return Configuration;
})(EngineConfiguration);

var Application = (function (Engine) {
  function Application() {
    if (!(this instanceof Application)) {
      return new Application();
    }
    _get(Object.getPrototypeOf(Application.prototype), "constructor", this).call(this);
  }

  _inherits(Application, Engine);

  _prototypeProperties(Application, null, {
    config: {
      get: function () {
        return this._config || (this._config = new Configuration());
      },
      set: function (configuration) {
        this._config = configuration;
      },
      configurable: true
    },
    configFor: {

      // config/foo.js
      value: function configFor(name) {
        console.log(this.paths.get("config").existent());
        //let file = path.resolve(this.paths.get('config'))
      },
      writable: true,
      configurable: true
    },
    defaultMiddlewareStack: {
      get: function () {
        var defaultStack = new DefaultMiddlewareStack(this, this.config, this.paths);
        return defaultStack.buildStack();
      },
      configurable: true
    }
  });

  return Application;
})(Engine);

exports.Configuration = Configuration;
exports.Application = Application;
exports.__esModule = true;