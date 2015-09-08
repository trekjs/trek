/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _lodashStringCamelCase = require('lodash/string/camelCase');

var _lodashStringCamelCase2 = _interopRequireDefault(_lodashStringCamelCase);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaServeStatic = require('koa-serve-static');

var _koaServeStatic2 = _interopRequireDefault(_koaServeStatic);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _composition = require('composition');

var _composition2 = _interopRequireDefault(_composition);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _trekRouter = require('trek-router');

var _trekRouter2 = _interopRequireDefault(_trekRouter);

var _routeMapper = require('route-mapper');

var _routeMapper2 = _interopRequireDefault(_routeMapper);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

/**
 * @class Engine
 * @constructor
 * @extends Koa
 * @param {String} rootPath The app root path.
 */

var Engine = (function (_Koa) {
  _inherits(Engine, _Koa);

  function Engine(rootPath) {
    _classCallCheck(this, Engine);

    _Koa.call(this);
    this.initialized = false;
    this.env = Trek.env;
    if (rootPath) this.rootPath = rootPath;
    this.initialize();
  }

  Engine.prototype.initialize = function initialize() {
    this.config = new _Config2['default'](this.rootPath);
    this.router = new _trekRouter2['default']();
    // override context
    this.context = new _Context2['default']();
  };

  /**
   * Set a working `rootPath` directory for app.
   *
   * @memberof Engine.prototype
   * @param {Root}
   */

  /**
   * Get a service by key.
   *
   * @memberof Engine.prototype
   * @method getService
   * @param {String} key
   * @return {Mixed} service
   */

  Engine.prototype.getService = function getService(key) {
    return this.services.get(key);
  };

  /**
   * Stores a service.
   *
   * @memberof Engine.prototype
   * @method setService
   * @param {String} key the service name
   * @param {Mixed} service the service instance
   */

  Engine.prototype.setService = function setService(key, value) {
    if (this.services.has(key)) {
      this.logger.warn(_chalk2['default'].green(`service:${ key } was registed`));
      return;
    }
    this.logger.debug(_chalk2['default'].yellow('service:%s'), key);
    this.services.set(key, value);
  };

  /**
   * Get views render.
   *
   * @return {GeneratorFunction|Promise} render
   */

  /**
   * @private
   */

  Engine.prototype.loadRoutes = function loadRoutes() {
    var _this = this;

    this.logger.debug(`Start load the routes.`);
    var routesPath = this.paths.get('config/routes', true);
    var controllersPath = this.paths.get('app/controllers', true);
    try {
      require(routesPath).call(this.routeMapper, this.routeMapper);
      this.routeMapper.routes.forEach(function (r) {
        var controller = r.controller;
        var action = r.action;

        var path = _path.join(controllersPath, controller) + '.js';
        var c = require(path);
        r.verb.forEach(function (m) {
          var a = undefined;
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a];
            _this.logger.debug(m, r.as, r.path, controller, action);
            _this[m].apply(_this, [r.path].concat(a));
          }
        });
      });
    } catch (e) {
      this.logger.warn(`Load the routes failed, ${ _chalk2['default'].red(e) }.`);
    }
  };

  /**
   * Load default middleware stack.
   *
   * @private
   */

  Engine.prototype.defaultMiddlewareStack = function defaultMiddlewareStack() {
    var stackPath = this.paths.get('config/middleware', true);
    try {
      require(stackPath)(this);
    } catch (e) {
      this.logger.warn(`Load the middleware failed, ${ _chalk2['default'].red(e) }.`);
    }
  };

  Engine.prototype.bootstrap = function* bootstrap() {
    yield this.config.load();
    this.defaultMiddlewareStack();
    this.loadRoutes();
    yield this.loadServices();
    this.use(function* dispatcher(next) {
      var _this2 = this;

      this.params = Object.create(null);

      var _app$router$find = this.app.router.find(this.method, this.path);

      var handler = _app$router$find[0];
      var params = _app$router$find[1];

      if (handler) {
        params.forEach(function (i) {
          _this2.params[i.name] = i.value;
        });
        var body = yield handler.call(this, next);
        if (body) {
          this.body = body;
          return;
        }
      }
      yield next;
    });
    return this;
  };

  /**
   * Load services.
   *
   * @private
   */

  Engine.prototype.loadServices = function* loadServices() {
    var files = this.paths.get('app/services');
    var seq = [];
    for (var file of files) {
      var _name = _path.basename(file, '.js').replace(/^[0-9]+-/, '');
      var service = require(`${ this.rootPath }/${ file }`)(this, this.config);
      if (service) {
        this.setService(_name, service);
        this.logger.debug(_chalk2['default'].green(`service:${ _name } init ...`));
        if (service.promise) yield service.promise;
        this.logger.debug(_chalk2['default'].green(`service:${ _name } booted`));
      }
    }
  };

  Engine.prototype['static'] = function _static(root, options, files) {
    return this.use(_koaStaticCache2['default'](root, options, files));
  };

  Engine.prototype.serveFile = function serveFile(file, path, options) {
    path = _path.dirname(path);
    this.get(file, _koaServeStatic2['default'](path, options));
    return this;
  };

  Engine.prototype.index = function index(file, options) {
    return this.serveFile('/', file, options);
  };

  Engine.prototype.listen = function listen() {
    var _Koa$prototype$listen;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_Koa$prototype$listen = _Koa.prototype.listen).call.apply(_Koa$prototype$listen, [this].concat(args));
  };

  Engine.prototype.run = function run() {
    var _this3 = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    this.logger.debug(_chalk2['default'].green('booting ...'));
    return _co2['default'].call(this, function* () {
      // TODO: https
      if (!args[0]) args[0] = this.config.get('site.port');
      this.server = this.listen.apply(this, args);
      var address = this.server.address();
      this.logger.info(_chalk2['default'].green('%s application starting in %s on http://%s:%s'), Trek.version, Trek.env, address.address === '::' ? '127.0.0.1' : address.address, address.port);
    })['catch'](function (e) {
      _this3.logger.error(_chalk2['default'].bold.red(`${ e.stack }`));
      _this3.logger.error(_chalk2['default'].red('boots failed.'));
    });
  };

  _createClass(Engine, [{
    key: 'rootPath',
    set: function set(rootPath) {
      this._rootPath = rootPath;
    },

    /**
     * The app working `rootPath` directory.
     *
     * @memberof Engine.prototype
     *
     */
    get: function get() {
      return this._rootPath || (this._rootPath = _path.dirname(require.main.filename));
    }

    /**
     * The `config.paths` delegation.
     *
     * @memberof Engine.prototype
     */
  }, {
    key: 'paths',
    get: function get() {
      return this.config.paths;
    }

    /**
     * The app `logger`.
     *
     * @memberof Engine.prototype
     * @return {winston.Logger}
     */
  }, {
    key: 'logger',
    get: function get() {
      return this._logger || (this._logger = Object.create(Trek.logger));
    }

    /**
     * Get all servides.
     *
     * @memberof Engine.prototype
     * @return {Map} services
     */
  }, {
    key: 'services',
    get: function get() {
      return this._services || (this._services = new Map());
    }
  }, {
    key: 'render',
    get: function get() {
      return this.context.render;
    },

    /**
     * Set views render.
     *
     * @param {GeneratorFunction|Promise} render
     */
    set: function set(render) {
      this.context.render = render;
    }

    /**
     * Get route mapper.
     *
     * @memberof Engine.prototype
     * @return {RouteMapper} routeMapper
     */
  }, {
    key: 'routeMapper',
    get: function get() {
      return this._routeMapper || (this._routeMapper = new _routeMapper2['default']());
    }
  }]);

  return Engine;
})(_koa2['default']);

_trekRouter2['default'].METHODS.forEach(function (m) {
  var name = m === 'delete' ? 'del' : m;
  Engine.prototype[m] = eval(`(function (c) {
      return (function ${ _lodashStringCamelCase2['default'](name) }(path, ...handlers) {
        handlers = c(handlers);
        this.router.add(m.toUpperCase(), path, handlers);
        return this;
      });
    })`)(_composition2['default']);
});

exports['default'] = Engine;
module.exports = exports['default'];