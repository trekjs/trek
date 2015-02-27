"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _hasOwn = Object.prototype.hasOwnProperty;

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var koaLoadMiddlewares = _interopRequire(require("koa-load-middlewares"));

var MiddlewareStack = require("./stack").MiddlewareStack;

var _engine = require("./engine");

var Engine = _engine.Engine;
var EngineConfiguration = _engine.Configuration;

var DefaultMiddlewareStack = (function () {
  function DefaultMiddlewareStack(app, config, paths) {
    _classCallCheck(this, DefaultMiddlewareStack);

    this.app = app;
    this.config = config;
    this.paths = paths;
  }

  _prototypeProperties(DefaultMiddlewareStack, null, {
    buildStack: {
      value: function buildStack() {
        return new MiddlewareStack(function (middleware) {
          var ms = koaLoadMiddlewares();
          middleware.use(ms.responseTime);
          middleware.use(ms.methodoverride);
          middleware.use(ms.xRequestId, undefined, true);

          // add logger
          // add remoteIp
          // add cookies
          // add session

          middleware.use(ms.bodyparser);
          middleware.use(function router() {
            // `this` is a koa app.
            return ms.router(this);
          });
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

    _classCallCheck(this, Configuration);

    _get(Object.getPrototypeOf(Configuration.prototype), "constructor", this).apply(this, args);
    this._helpersPaths = [];
    this._sessionStore = "cookieStore";
    this._sessionOptions = Object.create(null);
    this._timeZone = "UTC";
    this._logLevel = null;
    this._middleware = this.appMiddleware;
    this._generators = this.appGenerators;
    this._secretKeyBase = null;
  }

  _inherits(Configuration, EngineConfiguration);

  _prototypeProperties(Configuration, null, {
    paths: {
      get: function () {
        var _ref;

        return (_ref = this, !_hasOwn.call(_ref, "_paths") && (_ref._paths = (function (paths) {
          //paths.add('config/database',    { 'with': 'config/database.json' });
          paths.add("config/database", { "with": "config/database.js" });
          //paths.add('config/secrets',     { 'with': 'config/secrets.json' });
          paths.add("config/secrets", { "with": "config/secrets.js" });
          paths.add("config/environment", { "with": "config/environment.json" });
          paths.add("log", { "with": `log/${ Trek.env }.log` });
          paths.add("public");
          paths.add("tmp");
          return paths;
        })(_get(Object.getPrototypeOf(Configuration.prototype), "paths", this))), _ref._paths);
      },
      configurable: true
    },
    databaseConfiguration: {
      get: function () {
        var file = this.paths.get("config/database").existent[0];
        if (file) {
          file = path.resolve(file);
          if (fs.existsSync(file)) {}
        }
      },
      configurable: true
    },
    logLevel: {
      get: function () {
        var _ref;

        return (_ref = this, !_hasOwn.call(_ref, "_logLevel") && (_ref._logLevel = Trek.env === "production" ? "info" : "debug"), _ref._logLevel);
      },
      configurable: true
    },
    helpersPaths: {
      get: function () {
        return this._helpersPaths;
      },
      configurable: true
    },
    secretKeyBase: {
      get: function () {
        return this._secretKeyBase;
      },
      configurable: true
    }
  });

  return Configuration;
})(EngineConfiguration);

var Application = (function (Engine) {
  function Application() {
    _classCallCheck(this, Application);

    if (!(this instanceof Application)) {
      return new Application();
    }_get(Object.getPrototypeOf(Application.prototype), "constructor", this).call(this);
  }

  _inherits(Application, Engine);

  _prototypeProperties(Application, null, {
    config: {
      get: function () {
        return this._config || (this._config = new Configuration(this.findRoot(this.calledFrom)));
      },
      set: function (configuration) {
        this._config = configuration;
      },
      configurable: true
    },
    configFor: {

      // config/foo.js

      value: function configFor(name) {
        var file = this.paths.get("config").existent[0];
        var exist = false;
        if (file) {
          file = path.resolve(`${ file }/${ name }.json`);
          if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, "utf8") || "{}");
          }
        }
        if (!exist) {
          throw new Error(`Could not load configuration. No such file - ${ file }`);
        }
      },
      writable: true,
      configurable: true
    },
    envConfig: {
      get: function () {
        return this._appEnvConfig || (this.validateSecretKeyConfig(), this._appEnvConfig = Object.assign({}, _get(Object.getPrototypeOf(Application.prototype), "envConfig", this), { secretKeyBase: this.secrets.secretKeyBase }));
      },
      configurable: true
    },
    secrets: {
      get: function () {
        var _this = this;

        return this._secrets || (this._secrets = (function () {
          var secrets = {};
          var file = path.resolve(_this.config.paths.get("config/secrets").first);
          if (fs.existsSync(file)) {
            var allSecrets = require(file);
            var envSecrets = allSecrets[Trek.env];
            if (envSecrets) {
              Object.assign(secrets, envSecrets);
            }
          }
          var _secrets = secrets;
          if (!_hasOwn.call(_secrets, "secretKeyBase")) _secrets.secretKeyBase = _this.config.secretKeyBase;

          return secrets;
        })());
      },
      set: function (secrets) {
        this._secrets = secrets;
      },
      configurable: true
    },
    helpersPaths: {
      get: function () {
        return this.config.helpersPaths;
      },
      configurable: true
    },
    validateSecretKeyConfig: {
      value: function validateSecretKeyConfig() {
        if (!this.secrets.secretKeyBase) {
          throw new Error(`Missing \`secretKeyBase\` for '${ Trek.env }' environment,\
 set these values in \`config/secrets.js\``);
        }
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
Object.defineProperty(exports, "__esModule", {
  value: true
});