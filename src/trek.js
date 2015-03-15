/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import has from 'lodash-node/modern/object/has';
import chalk from 'chalk';
import winston from 'winston';
import Engine from './engine';

/**
 * @class Trek
 */
class Trek extends Engine {

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
    return require('../package.json');
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
   * Trek app `logger`.
   *
   * @getter
   * @property
   * @return {Object}
   * @api public
   */
  static get logger() {
    return this._logger || (this._logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)({
          label: chalk.green('Trek'),
          prettyPrint: true,
          colorize: true,
          level: Trek.env === 'production' ? 'info' : 'debug'
          //timestamp: true
        })
      ]
    }));
  }

  static get keys() {
    return ['Star Trek', 'EnterPrise', 'Spock']
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