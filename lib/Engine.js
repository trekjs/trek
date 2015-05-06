'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _path = require('path');

var _thenifyAll = require('thenify-all');

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _koaServeStatic = require('koa-serve-static');

var _koaServeStatic2 = _interopRequireDefault(_koaServeStatic);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _trekRouter = require('trek-router');

var _trekRouter2 = _interopRequireDefault(_trekRouter);

var _routeMapper = require('route-mapper');

var _routeMapper2 = _interopRequireDefault(_routeMapper);

var _composition = require('composition');

var _composition2 = _interopRequireDefault(_composition);

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
  function Engine(rootPath) {
    _classCallCheck(this, Engine);

    _Koa.call(this);

    if (rootPath) this.rootPath = rootPath;
    Trek.logger.debug('Application starts from %s.', _chalk2['default'].green(this.rootPath));
    this.initialize();
  }

  _inherits(Engine, _Koa);

  Engine.prototype.initialize = function initialize() {
    this.config = new _Config2['default'](this.rootPath);
    this.router = new _trekRouter2['default']();
    // override context
    this.context = new _Context2['default']();
  };

  /**
   * Send a mail.
   *
   * @memberof Engine.prototype
   * @method sendMail
   * @param {Object} data
   * @return {Promise}
   *
   * @example
   *  let result = yield app.sendMail(message);
   *
   */

  Engine.prototype.sendMail = function sendMail(data) {
    return this.mailer.send(data);
  };

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
      this.logger.debug(_chalk2['default'].green(`service:${ key } was registed`));
      return;
    }
    this.logger.debug(_chalk2['default'].yellow('service:%s'), key);
    this.services.set(key, value);
  };

  /**
   * @private
   */

  Engine.prototype.loadRoutes = function loadRoutes() {
    var _this = this;

    Trek.logger.debug(`Start load the routes.`);
    var routesPath = this.paths.get('config/routes', true);
    var controllersPath = this.paths.get('app/controllers', true);
    try {
      require(routesPath)(this.routeMapper);
      this.routeMapper.routes.forEach(function (r) {
        var controller = r.controller;
        var action = r.action;

        var path = _path.join(controllersPath, controller) + '.js';
        var c = require(path);
        r.verb.forEach(function (m) {
          var a = undefined;
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a];
            Trek.logger.debug(m, r.as, r.path, controller, action);
            _this[m].apply(_this, [r.path].concat(a));
          }
        });
      });
    } catch (e) {
      Trek.logger.debug(`Load the routes failed, ${ _chalk2['default'].red(e) }.`);
    }
  };

  /**
   * Load middleware stack
   *
   * @private
   */

  Engine.prototype.loadStack = function loadStack() {
    var loaded = true;
    var stackPath = this.paths.get('config/middleware');
    try {
      require(`${ this.rootPath }/${ stackPath }`)(this);
    } catch (e) {
      loaded = false;
      this.logger.debug(`Load failed ${ _chalk2['default'].red(stackPath) }, failed ${ e }`);
    }
  };

  /**
   * Load services
   *
   * @private
   */

  Engine.prototype.loadServices = function loadServices() {
    var files = this.paths.get('app/services');
    return _co2['default']((function* () {
      var seq = [];
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

        var file = _ref;

        var _name = _path.basename(file, '.js').replace(/^[0-9]+-/, '');
        var service = require(file)(this, this.config);
        if (service) {
          this.setService(_name, service);
          this.logger.info(_chalk2['default'].green(`service:${ _name } init ...`));
          if (service.promise) yield service.promise;
          this.logger.info(_chalk2['default'].green(`service:${ _name } booted`));
        }
      }
    }).bind(this));
  };

  Engine.prototype['static'] = function _static(root, options, files) {
    return this.use(_koaStaticCache2['default'](root, options, files));
  };

  Engine.prototype.serveFile = function serveFile(path, file, options) {
    file = _path.dirname(file);
    this.get(path, _koaServeStatic2['default'](file, options));
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

    this.loadStack();
    this.loadRoutes();
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
        yield* handler.call(this, next);
      }
      yield next;
    });
    return (_Koa$prototype$listen = _Koa.prototype.listen).call.apply(_Koa$prototype$listen, [this].concat(args));
  };

  Engine.prototype.run = function run() {
    var _this3 = this;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    this.logger.debug(_chalk2['default'].green('booting ...'));
    return this.loadServices().then(function () {
      // TODO: https
      if (!args[0]) args[0] = _this3.config.get('site.port');
      var app = _this3.listen.apply(_this3, args);
      _this3.logger.info(_chalk2['default'].green('%s application starting in %s on http://%s:%s'), Trek.version, Trek.env, app.address().address === '::' ? '127.0.0.1' : app.address().address, app.address().port);
      _this3._httpServer = app;
    })['catch'](function (e) {
      _this3.logger.error(_chalk2['default'].bold.red(`${ e.stack }`));
      _this3.logger.error(_chalk2['default'].red('boots failed.'));
    });
  };

  _createClass(Engine, [{
    key: 'rootPath',

    /**
     * The app working `rootPath` directory.
     *
     * @memberof Engine.prototype
     *
     */
    get: function () {
      return this._rootPath || (this._rootPath = _path.dirname(require.main.filename));
    },

    /**
     * Set a working `rootPath` directory for app.
     *
     * @memberof Engine.prototype
     * @param {Root}
     */
    set: function (rootPath) {
      this._rootPath = rootPath;
    }
  }, {
    key: 'paths',

    /**
     * The `config.paths` delegation.
     *
     * @memberof Engine.prototype
     */
    get: function () {
      return this.config.paths;
    }
  }, {
    key: 'logger',

    /**
     * The app `logger`.
     *
     * @memberof Engine.prototype
     * @return {winston.Logger}
     */
    get: function () {
      return this._logger || (this._logger = Object.create(Trek.logger));
    }
  }, {
    key: 'mailer',

    /**
     * The app `mailer`.
     *
     * @memberof Engine.prototype
     * @return {Mailer} mailer
     */
    get: function () {
      return this._mailer || (this._mailer = new Trek.Mailer(this.config.get('mail')));
    }
  }, {
    key: 'services',

    /**
     * Get all servides.
     *
     * @memberof Engine.prototype
     * @return {Map} services
     */
    get: function () {
      return this._services || (this._services = new Map());
    }
  }, {
    key: 'render',

    /**
     * Get views render.
     *
     * @return {GeneratorFunction|Promise} render
     */
    get: function () {
      return this.context.render;
    },

    /**
     * Set views render.
     *
     * @param {GeneratorFunction|Promise} render
     */
    set: function (render) {
      this.context.render = render;
    }
  }, {
    key: 'routeMapper',

    /**
     * Get route mapper.
     *
     * @memberof Engine.prototype
     * @return {RouteMapper} routeMapper
     */
    get: function () {
      return this._routeMapper || (this._routeMapper = new _routeMapper2['default']());
    }
  }]);

  return Engine;
})(_koa2['default']);

_trekRouter2['default'].METHODS.forEach(function (m) {
  var verb = m;
  m = m.toLowerCase();
  Engine.prototype[m] = function (path) {
    for (var _len3 = arguments.length, handlers = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      handlers[_key3 - 1] = arguments[_key3];
    }

    handlers = _composition2['default'](handlers);
    this.router.add(verb, path, handlers);
    return this;
  };
});

Engine.prototype.del = Engine.prototype['delete'];

exports['default'] = Engine;
module.exports = exports['default'];