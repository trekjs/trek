/*!
 * trek/engine
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
//import RouteMapper from 'route-mapper';
import Config from './config';
import extraContext from './context';
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
    extraContext(this.context);
    defaultStack(this);
  }

  /**
   * Loads environment variables from .env for app.
   *
   * @memberof Engine
   * @method
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
   *  ```
   *  let result = yield app.sendMail(message);
   *  ```
   *
   * @method
   * @public
   * @param {Object}
   * @param {Promise}
   */
  sendMail(data) {
    return this.mailer.send(data);
  }

  /**
   * Mount `app` with `prefix`, `app`
   * may be a Trek application or
   * middleware function.
   *
   * @method
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
   * @method
   * @public
   * @return {Promise}
   */
  run() {
    let self = this;
    self.logger.info(chalk.green('booting ...'));
    let config = self.config;
    let servicesPath = self.paths.get('app/services').path;
    this.keys = config.secrets.secretKeyBase;
    return co(function*() {
        let seq = [];
        let files = self.paths.get('app/services').existent;
        for (let file of files) {
          let name = path.basename(file, '.js').replace(/^[0-9]+-/, '');
          let service = require(file)(self, config);
          if (service) {
            self.setService(name, service);
            self.logger.info(chalk.green(`service:${name} init ...`));
            if (service.promise) yield service.promise;
            self.logger.info(chalk.green(`service:${name} booted`));
          }
        }
      })
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

  /*
  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper);
  }
  */

  get cache() {
    return this._cache || (this._cache = new Map);
  }

  get services() {
    return this._services || (this._services = new Map);
  }

  getService(key) {
    return this.services.get(key);
  }

  setService(key, value) {
    this.logger.log('info', chalk.yellow('service:%s'), key);
    this.services.set(key, value);
  }

}

export default Engine;
