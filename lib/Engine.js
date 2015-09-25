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

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

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

var _View = require('./View');

var _View2 = _interopRequireDefault(_View);

const METHODS = _trekRouter2['default'].METHODS;

/**
 * The Trek Engine Core
 * @extends {Koa}
 */

var Engine = (function (_Koa) {
  _inherits(Engine, _Koa);

  /**
   * @param {String} rootPath The app root path.
   */

  function Engine(rootPath) {
    _classCallCheck(this, Engine);

    _Koa.call(this);
    this.initialized = false;
    this.env = Trek.env;
    if (rootPath) this.rootPath = rootPath;
    this.initialize();
  }

  /**
   * @private
   */

  Engine.prototype.initialize = function initialize() {
    // top-most app is mounted at /
    this.mountpath = '/';
    this.config = new _Config2['default'](this.rootPath);
    this.router = new _trekRouter2['default']();
    // override context
    this.context = new _Context2['default']();
    this.engines = new Map();
    this.cache = Object.create(null);
    this.state = Object.create(null);
    this.state.config = this.config;
  };

  /**
   * Stores the `value` with `key` into `app.config`
   *
   * @returns {Engine} this
   */

  Engine.prototype.set = function set(key, value) {
    this.config.set(key, value);
    return this;
  };

  /**
   * Get the app prefix path
   *
   * @returns {String}
   */

  /**
   * Get a service by key
   *
   * @example
   *
   *  app.getService('db')
   *  // => db
   *
   * @param {String} key
   * @return {*} service
   */

  Engine.prototype.getService = function getService(key) {
    return this.services.get(key);
  };

  /**
   * Stores a service
   *
   * @example
   *
   *  app.setService('db', {})
   *
   * @param {String} key the service name
   * @param {*} service the service instance
   * @returns {void}
   */

  Engine.prototype.setService = function setService(key, value) {
    if (this.services.has(key)) {
      this.logger.warn(_chalk2['default'].green(`service:${ key } was registed`));
      return this;
    }
    this.logger.debug(_chalk2['default'].yellow(`service:${ key } setting...`));
    this.services.set(key, value);
    return this;
  };

  /**
   * Get route mapper.
   *
   * @return {RouteMapper} routeMapper
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
      //require(routesPath).call(this.routeMapper, this.routeMapper)
      this.routeMapper.draw(routesPath);
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
   * Load middleware stack
   *
   * @private
   */

  Engine.prototype.loadMiddlewareStack = function loadMiddlewareStack() {
    var stackPath = this.paths.get('config/middleware', true);
    var existed = !!stackPath;
    var loaded = false;
    var err = undefined;
    if (existed) {
      try {
        require(stackPath)(this, this.config);
        loaded = true;
      } catch (e) {
        err = e;
      }
    }
    if (!loaded) {
      stackPath = stackPath || this.paths.getPattern('config/middleware');
      this.logger.warn(`Missing ${ stackPath } or require failed, ${ _chalk2['default'].red(err || '') }.`);
    }
  };

  /**
   * Boot the app
   *
   * @returns {void}
   */

  Engine.prototype.bootstrap = function* bootstrap() {
    if (this.isBooted) return;
    yield this.config.load();
    yield this.loadServices();
    this.loadMiddlewareStack();
    this.loadRoutes();
    this.use(function* dispatcher(next) {
      var _this2 = this;

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
    this.isBooted = true;

    return this;
  };

  /**
   * Register the given template engine callback `fn` * as `ext`.
   *
   * @param {String} ext
   * @param {GeneratorFunction} fn
   * @returns {Engine} this
   */

  Engine.prototype.engine = function engine(ext, fn) {
    if (!fn) {
      throw new Error('GeneratorFunction or Function required');
    }

    // get file extension
    var extension = ext[0] !== '.' ? '.' + ext : ext;

    // store engine
    this.engines.set(extension, fn);

    return this;
  };

  /**
   * Render `view` with the given `options`
   *
   * @example
   *  yield app.render('site', { name: 'trek' })
   *
   * @param {String} view The name of view
   * @param {Object} options
   * @param {Boolean} options.cache Boolean hinting to the engine it should cache
   * @param {String} options.filename Filename of the view being rendered
   * @returns {String}
   */

  Engine.prototype.render = function* render(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    var renderOptions = Object.create(null);
    var view;

    // merge app.state
    Object.assign(renderOptions, this.state);

    // merge options._state
    if (options._state) {
      Object.assign(renderOptions, options._state);
    }

    // merge options
    Object.assign(renderOptions, options);

    // set .cache unless explicitly provided
    if (renderOptions.cache == null) {
      renderOptions.cache = this.config.get('view.cache');
    }

    // primed cache
    if (renderOptions.cache) {
      view = this.cache[name];
    }

    if (!view) {
      view = new _View2['default'](name, Object.create({
        defaultEngine: this.config.get('view.engine', 'html'),
        root: this.paths.get('app/views', true),
        engines: this.engines
      }));

      yield view.fetchPath();

      if (!view.path) {
        var dirs = Array.isArray(view.root) && view.root.length > 1 ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"' : 'directory "' + view.root + '"';
        var err = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
        err.view = view;
        throw err;
      }

      if (renderOptions.cache) {
        this.cache[name] = view;
      }
    }

    // render
    return yield view.render(renderOptions);
  };

  /**
   * Load services
   * @returns {void}
   */

  Engine.prototype.loadServices = function* loadServices() {
    var files = this.paths.get('app/services');
    var seq = [];
    for (var file of files) {
      var _name = _path.basename(file, '.js').replace(/^[0-9]+-/, '');
      this.logger.debug(_chalk2['default'].green(`service:${ _name } init...`));
      var service = require(`${ this.rootPath }/${ file }`)(this, this.config);
      if (service) {
        this.setService(_name, service);
        if (service.promise) yield service.promise;
        this.logger.debug(_chalk2['default'].green(`service:${ _name } booted`));
      }
    }
  };

  /**
   * Serves a file
   *
   * @param {String} path
   * @param {String} file
   * @param {Object} options
   * @returns {Engine} this
   */

  Engine.prototype.serveFile = function serveFile(path, file, options) {
    var dir = _path.dirname(file);
    return this.get(path, _koaStatic2['default'](dir, options));
  };

  /**
   * Serves files from a directory
   *
   * @param {String} path
   * @param {String} dir
   * @param {Object} options
   * @returns {Engine} this
   */

  Engine.prototype.serveDir = function serveDir(path, dir, options) {
    dir = _path.dirname(dir);
    return this.get(path + '*', _koaStatic2['default'](dir, options));
  };

  /**
   * Serves static files from a directory. It's an alias for `app#serveDir`
   *
   * @param {String} path
   * @param {String} dir
   * @param {Object} options
   * @returns {Engine} this
   */

  Engine.prototype['static'] = function _static(path, dir, options) {
    return this.serveDir(path, dir, options);
  };

  /**
   * Serves the default favicon - GET /favicon.ico
   *
   * @example
   *
   *  app.favicon('public/favicon.ico')
   *
   * @param {String} file
   * @returns {Engine} this
   */

  Engine.prototype.favicon = function favicon(file) {
    return this.serveFile('/favicon.ico', file);
  };

  /**
   * Index serves index file
   *
   * @param {String} file
   * @param {Object} options
   * @returns {Engine} this
   */

  Engine.prototype.index = function index(file, options) {
    return this.serveFile('/', file, options);
  };

  /**
   * Run the app
   *
   * @param {*} args
   * @returns {Promise}
   */

  Engine.prototype.run = function run() {
    var _this3 = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.logger.debug(_chalk2['default'].green('booting...'));
    return _co2['default'].call(this, function* () {
      yield this.bootstrap();
      // TODO: https
      if (!args[0]) args[0] = this.config.get('site.port');
      this.server = this.listen.apply(this, args);
      var address = this.server.address();
      this.logger.info(_chalk2['default'].green('The application starting in %s on http://%s:%s'), Trek.env, address.address === '::' ? '127.0.0.1' : address.address, address.port);
    })['catch'](function (e) {
      _this3.logger.error(_chalk2['default'].bold.red(`${ e.stack }`));
      _this3.logger.error(_chalk2['default'].red('boots failed.'));
    });
  };

  /**
   * Match adds a route > handler to the router for multiple HTTP methods provided
   *
   * @param {String[]} methods
   * @param {String} path
   * @param {GeneratorFunction[]} handler
   * @returns {Engine} this
   */

  Engine.prototype.match = function match(methods, path) {
    for (var _len2 = arguments.length, handler = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      handler[_key2 - 2] = arguments[_key2];
    }

    var _this4 = this;

    if (methods === undefined) methods = [];

    methods.forEach(function (m) {
      if (METHODS.includes(m)) {
        var v = m.replace('-', '');
        _this4[v].apply(_this4, [path].concat(handler));
      }
    });
    return this;
  };

  /**
   * Special-cased "all" method, applying the given route `path`,
   * middleware, and handler to _every_ HTTP method.
   *
   * @param {String} path
   * @param {GeneratorFunction[]} handler
   * @returns {Engine} this
   */

  Engine.prototype.all = function all(path) {
    for (var _len3 = arguments.length, handler = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      handler[_key3 - 1] = arguments[_key3];
    }

    return this.match.apply(this, [METHODS, path].concat(handler));
  };

  _createClass(Engine, [{
    key: 'path',
    get: function get() {
      return this.parent ? this.parent.path + this.mountpath : '';
    }

    /**
     * Set a working `rootPath` directory for app
     *
     * @param {String} root path
     */
  }, {
    key: 'rootPath',
    set: function set(rootPath) {
      this._rootPath = rootPath;
    },

    /**
     * The app working `rootPath` directory
     *
     * @returns {String}
     */
    get: function get() {
      return this._rootPath || (this._rootPath = _path.dirname(require.main.filename));
    }

    /**
     * The `config.paths` delegation
     *
     * @returns {Paths} config.paths
     */
  }, {
    key: 'paths',
    get: function get() {
      return this.config.paths;
    }

    /**
     * The app `logger`
     *
     * @return {winston.Logger}
     */
  }, {
    key: 'logger',
    get: function get() {
      return this._logger || (this._logger = Object.create(Trek.logger));
    }

    /**
     * Get all servides
     *
     * @example
     *
     *  app.services
     *  // return a `Map` object
     *  // => map
     *
     * @return {Map} services
     */
  }, {
    key: 'services',
    get: function get() {
      return this._services || (this._services = new Map());
    }
  }, {
    key: 'routeMapper',
    get: function get() {
      return this._routeMapper || (this._routeMapper = new _routeMapper2['default']());
    }
  }]);

  return Engine;
})(_koa2['default']);

exports['default'] = Engine;

METHODS.forEach(function (m) {
  var v = m.replace('-', '');
  Engine.prototype[v] = eval(`(function (c) {
      return (function $${ v }(path) {
        for (var _len = arguments.length - 1, handlers = Array(_len), _key = 0; _key < _len; _key++) {
          handlers[_key] = arguments[_key + 1]
        }
        handlers = c(handlers)
        this.router.add(m.toUpperCase(), path, handlers)
        return this
      });
    })`)(_composition2['default']);
});
module.exports = exports['default'];