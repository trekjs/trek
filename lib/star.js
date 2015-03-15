import chalk from 'chalk';
import winston from 'winston';

/**
 * Star Trek
 *
 * @return {Object}
 */

export default {

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
  get env() {
    return this._env || (
      process.env.TREK_ENV ||
      process.env.NODE_ENV ||
      process.env.IOJS_ENV ||
      'development');
  },

  /**
   * Returns Trek package informations.
   *
   * @static
   * @property package
   * @return {Object}
   * @api public
   */
  get package() {
    return require('../package.json');
  },

  /**
   * Returns Trek current version.
   *
   * @static
   * @property version
   * @return {String}
   * @api public
   */
  get version() {
    return this.package.version;
  },

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
          label: chalk.green('Trek'),
          level: 'debug',
          prettyPrint: true,
          colorize: true
          //timestamp: true
        })
      ]
    }));
  }

};