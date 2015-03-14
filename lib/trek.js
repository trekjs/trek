/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

import path from 'path';
import chalk from 'chalk';
import has from 'lodash-node/modern/object/has';
import co from 'co';
import _debug from 'debug';
import winston from 'winston';
import jsonwebtoken from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Koa from 'koa';
//import RouteMapper from 'route-mapper';
import Config from './config';
import extraContext from './context';
import { defaultStack } from './stack';

const debug = _debug('trek');

/**
 * @class Trek
 */
class Trek extends Koa {

  /**
   * Returns the current Trek environment.
   *
   *  ```
   *  Trek.env // => development | production | test
   *  ```
   *
   * @static
   * @property env
   * @default 'development'
   * @api public
   */
  static get env() {
    return this._env || (
      process.env.TREK_ENV ||
      process.env.NODE_ENV ||
      process.env.IOJS_ENV ||
      'development');
  }

  /**
   * Returns Trek package informations.
   *
   * @static
   * @property package
   * @return {Object}
   * @api public
   */
  static get package() {
    return this._package
      || (this._package = require(path.join(__dirname, '../package.json')));
  }

  /**
   * Returns Trek current version.
   *
   * @static
   * @property version
   * @return {String}
   * @api public
   */
  static get version() {
    return this.package.version;
  }

  /**
   * Initialize a new `Trek` app with a working `root` directory.
   *
   * @constructor
   * @param {String} root
   */
  constructor(root) {
    if (root) this.root = root;

    this.logger.debug(chalk.green('* Trek application starts from %s'), this.root);

    super()

    this.env = Trek.env;
    this.initialize();
  }

  /**
   * @api private
   */
  initialize() {
    this.config.initialize();
    extraContext(this.context);
    defaultStack(this);
  }

  /**
   * Returns `Trek` app working `root` directory.
   *
   * @getter
   * @property
   * @return {String}
   * @api public
   */
  get root() {
    return this._root
      || (this._root = path.dirname(require.main.filename));
  }

  /**
   * Sets a working `root` directory for `Trek` app.
   *
   * @setter
   * @property
   * @api public
   */
  set root(root) {
    this._root = root;
  }

  /**
   * Returns `Trek` app `config`.
   *
   * @getter
   * @property
   * @return {Mixed}
   * @api public
   */
  get config() {
    return this._config
      || (this._config = new Config(this.root));
  }

  /**
   * Sets `config` for `Trek` app.
   *
   * @setter
   * @property
   * @api public
   */
  set config(config) {
    this._config = config;
  }

  /**
   * Gets paths.
   *
   * @getter
   * @property
   * @return {Mixed}
   * @api public
   */
  get paths() {
    return this.config.paths;
  }

  /**
   * Trek app `logger`.
   *
   * @getter
   * @property
   * @return {Object}
   * @api public
   */
  get logger() {
    return this._logger || (this._logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)({
          level: 'debug',
          prettyPrint: true,
          colorize: true,
          timestamp: true
        })
      ]
    }));
  }

  /**
   * Trek app `mailer`.
   *
   * @getter
   * @property
   * @return {Object}
   * @api public
   */
  get mailer() {
    return this._mailer || (() => {
      let transport = this.config.get('mailer.transport');
      let options = this.config.get('mailer.options');
      let moduleName = `nodemailer-${transport}-transport`;
      let transporter;
      if (transport) {
        try {
          transporter = require(moduleName);
        } catch (e) {
          this.app.logger.error(chalk.bold.red(`Missing ${moduleName}.`));
        }
      }
      return this._mailer = nodemailer.createTransport(
        transport ? transporter(options) : options
      );
    })();
  }

  /**
   * Trek app `sendMail`.
   *
   * @method
   * @param {Object}
   * @param {Callback}
   * @api public
   */
  sendMail(data, done) {
    this.mailer.sendMail(data, done);
  }

  /**
   * Trek app `jwt`.
   *
   * @getter
   * @property
   * @param {Object}
   * @api public
   */
  get jwt() {
    return this._jwt || (() => {
      return this._jwt = jsonwebtoken;
    })();
  }

  /**
   * Runs Trek app.
   *
   * @method
   * @return {Promise}
   * @api public
   */
  run() {
    let self = this;
    self.logger.info(chalk.green('* Trek booting ...'));
    let config = self.config;
    let servicesPath = self.paths.get('app/services').path
    return co(function* () {
      let seq = [];
      let files = self.paths.get('app/services').existent;
      for (let file of files) {
        let name = path.basename(file, '.js').replace(/^[0-9]+-/, '');
        let service = require(file)(self, config);
        if (service) {
          self.setService(name, service);
          self.logger.info(chalk.green(`* Trek service:${name} init ...`));
          if (service.promise) yield service.promise;
          self.logger.info(chalk.green(`* Trek service:${name} booted`));
        }
      }
    })
      .then(() => {
        // TODO: https
        let args = [...arguments];
        if (!args[0]) args[0] = this.config.get('site.port');
        let app = this.listen(...args);
        this.logger.info(
          chalk.green('* Trek %s application starting in %s on http://%s:%s'),
          Trek.version,
          Trek.env,
          app.address().address === '::' ? '127.0.0.1' : app.address().address,
          app.address().port
        );
        this._httpServer = app;
      })
      .catch((e) => {
        this.logger.error(chalk.bold.red(`${e}`));
        this.logger.error(chalk.red('* Trek boots failed.'));
      })
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
    this.logger.log('info', chalk.yellow('* Trek service:%s'), key);
    this.services.set(key, value);
  }

}

/**
 * Puts `Trek` to the global.
 *
 * @static
 * @property Trek
 * @return {Mixed}
 * @api public
 */
if (!has(global, 'Trek')) global.Trek = Trek;

export default global.Trek;