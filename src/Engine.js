/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { dirname, join } from 'path';
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

  /**
   * @constructs
   */
  initialize() {
    this.config = new Config(this.rootPath);
    this.router = new Router();
    // override context
    this.context = new Context();
  }

  /**
   * The app working `rootPath` directory.
   *
   * @type {String} rootPath
   */
  get rootPath() {
    return this._rootPath || (this._rootPath = dirname(require.main.filename));
  }

  /**
   * Set a working `rootPath` directory for app.
   *
   * @param {Root}
   */
  set rootPath(rootPath) {
    this._rootPath = rootPath;
  }

  /**
   * The `config.paths` delegation.
   *
   * @type {Root} paths
   */
  get paths() {
    return this.config.paths;
  }

  /**
   * The app `logger`.
   *
   * @return {winston.Logger}
   */
  get logger() {
    return this._logger || (this._logger = Object.create(Trek.logger));
  }

  /**
   * The app `mailer`.
   *
   * @return {Mailer} mailer
   */
  get mailer() {
    return this._mailer || (this._mailer = new Trek.Mailer(this.config.get('mail')));
  }

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
  sendMail(data) {
    return this.mailer.send(data);
  }

  /**
   * Get route mapper.
   *
   * @return {RouteMapper} routeMapper
   */
  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper());
  }

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
      Trek.logger.error(`Load the routes failed, %s.`, chalk.red(e));
    }
  }

  /**
   * Get all servides.
   *
   * @return {Map} services
   */
  get services() {
    return this._services || (this._services = new Map());
  }

  /**
   * Get a service by key.
   *
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
   * @method setService
   * @param {String} key the service name
   * @param {Mixed} service the service instance
   */
  setService(key, value) {
    if (this.services.has(key)) {
      this.logger.info(chalk.green(`service:${key} was registed`));
      return;
    }
    this.logger.log('info', chalk.yellow('service:%s'), key);
    this.services.set(key, value);
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

  run() {
    this.logger.debug(chalk.green('booting ...'));
    this.loadRoutes();
    this.use(function* dispatcher(next) {
      this.params = Object.create(null);
      let result = this.app.router.find(this.method, this.path);
      if (result && result[0]) {
        result[1].forEach((i) => {
          this.params[i.name] = i.value;
        });
        yield result[0].call(this, next);
      }
      yield next;
    });
    return this.listen(...arguments);
  }

}

[
  'CONNECT',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
  'TRACE'
].forEach((m) => {
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
