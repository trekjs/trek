/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { basename, dirname, join } from 'path';
import { thenify } from 'thenify-all';
import staticCache from 'koa-static-cache';
import serveStatic from 'koa-serve-static';
import co from 'co';
import Koa from 'koa';
import chalk from 'chalk';
import Router from 'trek-router';
import RouteMapper from 'route-mapper';
import composition from 'composition';
import Config from './Config';
import Context from './Context';

/**
 * @class Engine
 * @constructor
 * @extends Koa
 * @param {String} rootPath The app root path.
 */
class Engine extends Koa {
  constructor(rootPath) {
    super();
    if (rootPath) this.rootPath = rootPath;
    Trek.logger.debug('Application starts from %s.', chalk.green(this.rootPath));
    this.initialize();
  }

  initialize() {
    this.config = new Config(this.rootPath);
    this.router = new Router();
    // override context
    this.context = new Context();
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
   * Set a working `rootPath` directory for app.
   *
   * @memberof Engine.prototype
   * @param {Root}
   */
  set rootPath(rootPath) {
    this._rootPath = rootPath;
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
   * The app `mailer`.
   *
   * @memberof Engine.prototype
   * @return {Mailer} mailer
   */
  /*
  get mailer() {
    return this._mailer || (this._mailer = new Trek.Mailer(this.config.get('mail')));
  }
  */

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
  /*
  sendMail(data) {
    return this.mailer.send(data);
  }
  */

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
      this.logger.debug(chalk.green(`service:${key} was registed`));
      return;
    }
    this.logger.debug(chalk.yellow('service:%s'), key);
    this.services.set(key, value);
  }

  /**
   * Get views render.
   *
   * @return {GeneratorFunction|Promise} render
   */
  get render() {
    return this.context.render;
  }

  /**
   * Set views render.
   *
   * @param {GeneratorFunction|Promise} render
   */
  set render(render) {
    this.context.render = render;
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
    Trek.logger.debug(`Start load the routes.`);
    let routesPath = this.paths.get('config/routes', true);
    let controllersPath = this.paths.get('app/controllers', true);
    try {
      require(routesPath)(this.routeMapper);
      this.routeMapper.routes.forEach(r => {
        let { controller, action } = r;
        let path = join(controllersPath, controller) + '.js';
        let c = require(path);
        r.verb.forEach((m) => {
          let a;
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a];
            Trek.logger.debug(m, r.as, r.path, controller, action);
            this[m](r.path, ...a);
          }
        });
      });
    } catch (e) {
      Trek.logger.debug(`Load the routes failed, ${chalk.red(e)}.`);
    }
  }

  /**
   * Load middleware stack
   *
   * @private
   */
  loadStack() {
    let loaded = true;
    let stackPath = this.paths.get('config/middleware');
    try {
      require(`${this.rootPath}/${stackPath}`)(this);
    } catch (e) {
      loaded = false;
      this.logger.debug(`Load failed ${chalk.red(stackPath)}, failed ${e}`);
    }
  }

  /**
   * Load services
   *
   * @private
   */
  loadServices() {
    let files = this.paths.get('app/services');
    return co(function*() {
      let seq = [];
      for (let file of files) {
        let name = basename(file, '.js').replace(/^[0-9]+-/, '');
        let service = require(`${this.rootPath}/${file}`)(this, this.config);
        if (service) {
          this.setService(name, service);
          this.logger.info(chalk.green(`service:${name} init ...`));
          if (service.promise) yield service.promise;
          this.logger.info(chalk.green(`service:${name} booted`));
        }
      }
    }.bind(this));
  }

  ['static'](root, options, files) {
    return this.use(staticCache(root, options, files));
  }

  serveFile(path, file, options) {
    file = dirname(file);
    this.get(path, serveStatic(file, options));
    return this;
  }

  index(file, options) {
    return this.serveFile('/', file, options);
  }

  listen(...args) {
    this.loadStack();
    this.loadRoutes();
    this.use(function* dispatcher(next) {
      this.params = Object.create(null);
      let [handler, params] = this.app.router.find(this.method, this.path);
      if (handler) {
        params.forEach((i) => {
          this.params[i.name] = i.value;
        });
        yield* handler.call(this, next);
      }
      yield next;
    });
    return super.listen(...args);
  }

  run(...args) {
    this.logger.debug(chalk.green('booting ...'));
    return this.loadServices()
      .then(() => {
        // TODO: https
        if (!args[0]) args[0] = this.config.get('site.port');
        let app = this.listen(...args);
        this.logger.info(
          chalk.green('%s application starting in %s on http://%s:%s'),
          Trek.version,
          Trek.env,
          app.address().address === '::' ? '127.0.0.1' : app.address().address,
          app.address().port
        );
        this._httpServer = app;
      })
      .catch((e) => {
        this.logger.error(chalk.bold.red(`${e.stack}`));
        this.logger.error(chalk.red('boots failed.'));
      });
  }

}

Router
  .METHODS
  .forEach((m) => {
    let verb = m;
    m = m.toLowerCase();
    Engine.prototype[m] = function(path, ...handlers) {
      handlers = composition(handlers);
      this.router.add(verb, path, handlers);
      return this;
    };
  });

Engine.prototype.del = Engine.prototype.delete;

export default Engine;
