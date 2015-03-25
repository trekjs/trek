/*!
 * trek - lib/Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
import path from 'path';
import chalk from 'chalk';
import co from 'co';
import Koa from 'koa';
import mount from 'koa-mount';
import RouteMapper from 'route-mapper';
import Config from './Config';
import Context from './Context';
import defaultStack from './stack';

/**
 * @class Engine
 * @public
 */
class Engine extends Koa {

  /**
   * Initialize a new app with a working `root` directory.
   *
   * @constructor Engine
   * @param {String} root
   */
  constructor(root) {
    if (root) this.root = root;

    this.logger.debug('Application starts from %s.', chalk.green(this.root));

    super();

    this.initialize();
  }

  /**
   * @constructs
   * @private
   */
  initialize() {
    this.dotenv();
    this.config.initialize();
    this.overrideContext();
    let secretKeyBase = this.config.secrets.secretKeyBase;
    if (secretKeyBase) {
      this.keys = Array.isArray(secretKeyBase) ? secretKeyBase : [secretKeyBase];
    } else {
      this.keys = Trek.keys;
    }
    defaultStack(this);
  }

  /**
   * Override the original `koa-context` object.
   *
   * @method overrideContext
   * @private
   */
  overrideContext() {
    this.context = new Context();
  }

  /**
   * Loads environment variables from .env for app.
   *
   * @memberof Engine
   * @method dotenv
   * @public
   */
  dotenv() {
    let loaded = Trek.dotenv.config({
      path: `${this.root}/.env`
    });
    if (!loaded) this.logger.debug('Missing %s.', chalk.red('.env'));
    loaded = Trek.dotenv.config({
      path: `${this.root}/.env.${Trek.env}`
    });
    if (!loaded) this.logger.debug('Missing %s.', chalk.red(`.env.${Trek.env}`));
  }

  /**
   * Returns app working `root` directory.
   *
   * @public
   * @return {String}
   */
  get root() {
    return this._root || (this._root = path.dirname(require.main.filename));
  }

  /**
   * Sets a working `root` directory for app.
   *
   * @param {Root}
   * @public
   */
  set root(root) {
    this._root = root;
  }

  /**
   * Gets current app name.
   * Defaults to `Trek`.
   *
   * @public
   * @return {String}
   */
  get name() {
    return this._name || (this._name = this.config.get('name') || 'Trek');
  }

  /**
   * Sets current app name.
   *
   * @public
   * @param {String}
   */
  set name(name) {
    this._name = name;
  }

  /**
   * Returns app `config`.
   *
   * @public
   * @return {Mixed}
   */
  get config() {
    return this._config || (this._config = new Config(this));
  }

  /**
   * Sets `config` for  app.
   *
   * @public
   */
  set config(config) {
    this._config = config;
  }

  /**
   * Gets paths.
   *
   * @public
   * @return {Root}
   */
  get paths() {
    return this.config.paths;
  }

  /**
   * Trek app `logger`.
   *
   * @public
   * @return {winston.Logger}
   */
  get logger() {
    return this._logger || (this._logger = Object.create(Trek.logger));
  }

  /**
   * Trek app `mailer`.
   *
   * @public
   * @return {Mailer}
   */
  get mailer() {
    return this._mailer || (this._mailer = new Trek.Mailer(this.config.get('mail')));
  }

  /**
   * Trek app `sendMail`.
   *
   * @example
   *  let result = yield app.sendMail(message);
   *
   * @method sendMail
   * @public
   * @param {Object}
   * @param {Promise}
   */
  sendMail(data) {
    return this.mailer.send(data);
  }

  /**
   * Gets all servides.
   *
   * @public
   * @return {Map}
   */
  get services() {
    return this._services || (this._services = new Map());
  }

  /**
   * Gets a service.
   *
   * @method getService
   * @public
   * @param {String} service
   * @return {Mixed}
   */
  getService(key) {
    return this.services.get(key);
  }

  /**
   * Stores a service.
   *
   * @method setService
   * @public
   * @param {String} key - the service name
   * @param {Mixed} service - the service instance
   * @return {Mixed} service
   */
  setService(key, value) {
    if (this.services.has(key)) {
      this.logger.info(chalk.green(`service:${key} was registed`));
      return;
    }
    this.logger.log('info', chalk.yellow('service:%s'), key);
    this.services.set(key, value);
  }

  /**
   * Mount `app` with `prefix`, `app`
   * may be a Trek application or
   * middleware function.
   *
   * @method mount
   * @public
   * @param {String|Application|Function} prefix, app, or function
   * @param {Application|Function} [app or function]
   */
  mount() {
    return this.use(mount(...arguments));
  }

  /**
   * Runs app.
   *
   * @method run
   * @public
   * @return {Promise}
   */
  run() {
    this.logger.info(chalk.green('booting ...'));
    this.loadRouteMapper();
    let config = this.config;
    let servicesPath = this.paths.get('app/services').path;
    return co(function*() {
        let seq = [];
        let files = this.paths.get('app/services').existent;
        for (let file of files) {
          let name = path.basename(file, '.js').replace(/^[0-9]+-/, '');
          let service = require(file)(this, config);
          if (service) {
            this.setService(name, service);
            this.logger.info(chalk.green(`service:${name} init ...`));
            if (service.promise) yield service.promise;
            this.logger.info(chalk.green(`service:${name} booted`));
          }
        }
      }.bind(this))
      .then(() => {
        // TODO: https
        let args = [...arguments];
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

  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper());
  }

  loadRouteMapper() {
    this.logger.debug(`Load the routes.`);
    var routesPath = this.paths.get('config/routes').path;
    var controllersPath = this.paths.get('app/controllers').path;
    try {
      require(routesPath)(this.routeMapper);
      this.routeMapper.routes.forEach(r => {
        r.verb.forEach((m) => {
          let controller = r.controller;
          let action = r.action;
          try {
            let c = require(controllersPath + '/' + controller + '.js');
            let a;
            if (c && (a = c[action])) {
              if (!Array.isArray(a)) a = [a];
              this.logger.info(r.as, r.path, controller, action);
              if (r.as) {
                this[m](r.as, r.path, ...a);
              } else {
                this[m](r.path, ...a);
              }
            }
          } catch (e) {
            this.logger.error(`Missing the ${controller}#${action}.`);
          }
        });
      });
    } catch (e) {
      this.logger.error(`Load the routes failed, ${e}`);
    }
  }

}

export default Engine;
