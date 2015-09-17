/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { basename, dirname, join } from 'path';
import staticCache from 'koa-static-cache';
import serveStatic from 'koa-serve-static';
import chalk from 'chalk';
import co from 'co';
import composition from 'composition';
import Koa from 'koa';
import Router from 'trek-router';
import RouteMapper from 'route-mapper';
import Config from './Config';
import Context from './Context';
import View from './View';

/**
 * @class Engine
 * @constructor
 * @extends Koa
 * @param {String} rootPath The app root path.
 */
class Engine extends Koa {

  constructor(rootPath) {
    super();
    this.initialized = false;
    this.env = Trek.env;
    if (rootPath) this.rootPath = rootPath;
    this.initialize();
  }

  initialize() {
    this.config = new Config(this.rootPath);
    this.router = new Router();
    // override context
    this.context = new Context();
    this.engines = new Map();
    this.cache = Object.create(null);
    console.log(this.state);
    //this.state.config = this.config;
  }

  /**
   * Set a working `rootPath` directory for app.
   *
   * @memberof Engine.prototype
   * @param {Root}
   */
  set rootPath(rootPath) {
    this._rootPath = rootPath;
  }

  /**
   * The app working `rootPath` directory.
   *
   * @memberof Engine.prototype
   *
   */
  get rootPath() {
    return this._rootPath || (this._rootPath = dirname(require.main.filename));
  }

  /**
   * The `config.paths` delegation.
   *
   * @memberof Engine.prototype
   */
  get paths() {
    return this.config.paths;
  }

  /**
   * The app `logger`.
   *
   * @memberof Engine.prototype
   * @return {winston.Logger}
   */
  get logger() {
    return this._logger || (this._logger = Object.create(Trek.logger));
  }

  /**
   * Get all servides.
   *
   * @memberof Engine.prototype
   * @return {Map} services
   */
  get services() {
    return this._services || (this._services = new Map());
  }

  /**
   * Get a service by key.
   *
   * @memberof Engine.prototype
   * @method getService
   * @param {String} key
   * @return {Mixed} service
   */
  getService(key) {
    return this.services.get(key);
  }

  /**
   * Stores a service.
   *
   * @memberof Engine.prototype
   * @method setService
   * @param {String} key the service name
   * @param {Mixed} service the service instance
   */
  setService(key, value) {
    if (this.services.has(key)) {
      this.logger.warn(chalk.green(`service:${key} was registed`));
      return;
    }
    this.logger.debug(chalk.yellow('service:%s'), key);
    this.services.set(key, value);
  }

  /**
   * Get route mapper.
   *
   * @memberof Engine.prototype
   * @return {RouteMapper} routeMapper
   */
  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper());
  }

  /**
   * @private
   */
  loadRoutes() {
    this.logger.debug(`Start load the routes.`);
    let routesPath = this.paths.get('config/routes', true);
    let controllersPath = this.paths.get('app/controllers', true);
    try {
      //require(routesPath).call(this.routeMapper, this.routeMapper);
      this.routeMapper.draw(routesPath);
      this.routeMapper.routes.forEach(r => {
        let { controller, action } = r;
        let path = join(controllersPath, controller) + '.js';
        let c = require(path);
        r.verb.forEach((m) => {
          let a;
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a];
            this.logger.debug(m, r.as, r.path, controller, action);
            this[m](r.path, ...a);
          }
        });
      });
    } catch (e) {
      this.logger.warn(`Load the routes failed, ${chalk.red(e)}.`);
    }
  }

  /**
   * Load default middleware stack.
   *
   * @private
   */
  defaultMiddlewareStack() {
    let stackPath = this.paths.get('config/middleware', true);
    let existed = !!stackPath;
    let loaded = false;
    let err;
    if (existed) {
      try {
        require(stackPath)(this);
        loaded = true;
      } catch (e) {
        err = e;
      }
    }
    if (!loaded) {
      stackPath = stackPath || this.paths.getPattern('config/middleware');
      this.logger.warn(`Missing ${stackPath} or require failed, ${chalk.red(err || '')}.`);
    }
  }

  *bootstrap() {
    yield this.config.load();
    this.defaultMiddlewareStack();
    this.loadRoutes();
    yield this.loadServices();
    this.use(function* dispatcher(next) {
      this.params = Object.create(null);
      let [handler, params] = this.app.router.find(this.method, this.path);
      if (handler) {
        params.forEach((i) => {
          this.params[i.name] = i.value;
        });
        let body = yield handler.call(this, next);
        if (body) {
          this.body = body;
          return;
        }
      }
      yield next;
    });
    return this;
  }

  engine(ext, fn) {
    if (!fn || 'GeneratorFunction'  !== fn.constructor.name) {
      throw new Error('GeneratorFunction required');
    }

    // get file extension
    var extension = ext[0] !== '.'
      ? '.' + ext
      : ext;

    // store engine
    this.engines.set(extension, fn);
  }

  *render(name, options = Object.create(null)) {
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
      view = new View(name, Object.create({
        defaultEngine: this.config.get('view.engine'),
        root: this.paths.get('app/views', true),
        engines: this.engines
      }));

      yield view.fetchPath();

      if (!view.path) {
        var dirs = Array.isArray(view.root) && view.root.length > 1
          ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
          : 'directory "' + view.root + '"'
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
  }

  /**
   * Load services.
   *
   * @private
   */
  *loadServices() {
    let files = this.paths.get('app/services');
    let seq = [];
    for (let file of files) {
      let name = basename(file, '.js').replace(/^[0-9]+-/, '');
      let service = require(`${this.rootPath}/${file}`)(this, this.config);
      if (service) {
        this.setService(name, service);
        this.logger.debug(chalk.green(`service:${name} init ...`));
        if (service.promise) yield service.promise;
        this.logger.debug(chalk.green(`service:${name} booted`));
      }
    }
  }

  ['static'](root, options, files) {
    return this.use(staticCache(root, options, files));
  }

  serveFile(file, path, options) {
    path = dirname(path);
    this.get(file, serveStatic(path, options));
    return this;
  }

  index(file, options) {
    return this.serveFile('/', file, options);
  }

  listen(...args) {
    return super.listen(...args);
  }

  run(...args) {
    this.logger.debug(chalk.green('booting ...'));
    return co.call(this, function* () {
      yield this.bootstrap();
      // TODO: https
      if (!args[0]) args[0] = this.config.get('site.port');
      this.server = this.listen(...args);
      let address = this.server.address();
      this.logger.info(
        chalk.green('The application starting in %s on http://%s:%s'),
        Trek.env,
        address.address === '::' ? '127.0.0.1' : address.address,
        address.port
      );
    }).catch((e) => {
      this.logger.error(chalk.bold.red(`${e.stack}`));
      this.logger.error(chalk.red('boots failed.'));
    });
  }

}

Router
  .METHODS
  .forEach((m) => {
    let v = m.replace('-', '');
    let name = v === 'delete' ? 'del' : v;
    Engine.prototype[v] = eval(`(function (c) {
      return (function ${name}(path) {
        for (var _len = arguments.length - 1, handlers = Array(_len), _key = 0; _key < _len; _key++) {
          handlers[_key] = arguments[_key + 1];
        }
        handlers = c(handlers);
        this.router.add(m.toUpperCase(), path, handlers);
        return this;
      });
    })`)(composition);
  });

export default Engine;
