'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _dirname$join = require('path');

var _thenify = require('thenify-all');

var _staticCache = require('koa-static-cache');

var _staticCache2 = _interopRequireWildcard(_staticCache);

var _serveStatic = require('koa-serve-static');

var _serveStatic2 = _interopRequireWildcard(_serveStatic);

var _co = require('co');

var _co2 = _interopRequireWildcard(_co);

var _Koa2 = require('koa');

var _Koa3 = _interopRequireWildcard(_Koa2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireWildcard(_chalk);

var _Router = require('trek-router');

var _Router2 = _interopRequireWildcard(_Router);

var _RouteMapper = require('route-mapper');

var _RouteMapper2 = _interopRequireWildcard(_RouteMapper);

var _composition = require('composition');

var _composition2 = _interopRequireWildcard(_composition);

var _Config = require('./Config');

var _Config2 = _interopRequireWildcard(_Config);

var _Context = require('./Context');

var _Context2 = _interopRequireWildcard(_Context);

/**
 * @class Engine
 * @extends Koa
 * @param {String} rootPath The app root path.
 */

let Engine = (function (_Koa) {
  function Engine(rootPath) {
    _classCallCheck(this, Engine);

    _Koa.call(this);

    if (rootPath) this.rootPath = rootPath;
    Trek.logger.debug('Application starts from %s.', _chalk2['default'].green(this.rootPath));
    this.initialize();
  }

  _inherits(Engine, _Koa);

  /**
   * @constructs
   */

  Engine.prototype.initialize = function initialize() {
    this.config = new _Config2['default'](this.rootPath);
    this.router = new _Router2['default']();
    // override context
    this.context = new _Context2['default']();
  };

  /**
   * Send a mail.
   *
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

  Engine.prototype.loadRoutes = function loadRoutes() {
    var _this = this;

    Trek.logger.debug(`Start load the routes.`);
    let routesPath = this.paths.get('config/routes', true);
    let controllersPath = this.paths.get('app/controllers', true);
    try {
      require(routesPath)(this.routeMapper);
      this.routeMapper.routes.forEach(function (r) {
        let controller = r.controller;
        let action = r.action;

        let path = _dirname$join.join(controllersPath, controller) + '.js';
        let c = require(path);
        r.verb.forEach(function (m) {
          let a;
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a];
            Trek.logger.debug(m, r.as, r.path, controller, action);
            _this[m].apply(_this, [r.path].concat(a));
          }
        });
      });
    } catch (e) {
      Trek.logger.error(`Load the routes failed, %s.`, _chalk2['default'].red(e));
    }
  };

  /**
   * Get a service by key.
   *
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
   * @method setService
   * @param {String} key the service name
   * @param {Mixed} service the service instance
   */

  Engine.prototype.setService = function setService(key, value) {
    if (this.services.has(key)) {
      this.logger.info(_chalk2['default'].green(`service:${ key } was registed`));
      return;
    }
    this.logger.log('info', _chalk2['default'].yellow('service:%s'), key);
    this.services.set(key, value);
  };

  Engine.prototype['static'] = function _static(root, options, files) {
    return this.use(_staticCache2['default'](root, options, files));
  };

  Engine.prototype.serveFile = function serveFile(path, file, options) {
    file = _dirname$join.dirname(file);
    this.get(path, _serveStatic2['default'](file, options));
    return this;
  };

  Engine.prototype.index = function index(file, options) {
    return this.serveFile('/', file, options);
  };

  Engine.prototype.run = function run() {
    this.logger.debug(_chalk2['default'].green('booting ...'));
    this.loadRoutes();
    this.use(function* dispatcher(next) {
      var _this2 = this;

      this.params = Object.create(null);
      let result = this.app.router.find(this.method, this.path);
      if (result && result[0]) {
        result[1].forEach(function (i) {
          _this2.params[i.name] = i.value;
        });
        yield result[0].call(this, next);
      }
      yield next;
    });
    return this.listen.apply(this, arguments);
  };

  _createClass(Engine, [{
    key: 'rootPath',

    /**
     * The app working `rootPath` directory.
     *
     * @type {String} rootPath
     */
    get: function () {
      return this._rootPath || (this._rootPath = _dirname$join.dirname(require.main.filename));
    },

    /**
     * Set a working `rootPath` directory for app.
     *
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
     * @type {Root} paths
     */
    get: function () {
      return this.config.paths;
    }
  }, {
    key: 'logger',

    /**
     * The app `logger`.
     *
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
     * @return {Mailer} mailer
     */
    get: function () {
      return this._mailer || (this._mailer = new Trek.Mailer(this.config.get('mail')));
    }
  }, {
    key: 'routeMapper',

    /**
     * Get route mapper.
     *
     * @return {RouteMapper} routeMapper
     */
    get: function () {
      return this._routeMapper || (this._routeMapper = new _RouteMapper2['default']());
    }
  }, {
    key: 'services',

    /**
     * Get all servides.
     *
     * @return {Map} services
     */
    get: function () {
      return this._services || (this._services = new Map());
    }
  }]);

  return Engine;
})(_Koa3['default']);

['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'].forEach(function (m) {
  let verb = m;
  m = m.toLowerCase();
  Engine.prototype[m] = function (path) {
    for (var _len = arguments.length, handlers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      handlers[_key - 1] = arguments[_key];
    }

    handlers = _composition2['default'](handlers);
    this.router.add(verb, path, handlers);
    return this;
  };
});

Engine.prototype.del = Engine.prototype['delete'];

exports['default'] = Engine;
module.exports = exports['default'];