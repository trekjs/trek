/*!
 * trek - Trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import winston from 'winston';
import Engine from './Engine';

/**
 * @class Trek
 * @namespace Trek
 * @extends Engine
 * @param {String} rootPath The app root path.
 */

export default class Trek extends Engine {

  /**
   * Returns the current Trek environment.
   *
   * @static
   * @default 'development'
   *
   * @example
   *  Trek.env
   *  // => development | production | test
   */
  static get env() {
    return this._env || (this._env =
      process.env.TREK_ENV ||
      process.env.NODE_ENV ||
      'development');
  }

  /**
   * Returns true if current environment is `production`.
   *
   * @static
   * @memberof Trek
   */
  static get isProduction() {
    return this.env === 'production';
  }

  /**
   * Returns true if current environment is `development`.
   *
   * @static
   */
  static get isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Returns true if current environment is `test`.
   *
   * @static
   */
  static get isTest() {
    return this.env === 'test';
  }

  /**
   * Returns Trek package information.
   *
   * @static
   */
  static get package() {
    return require('../package');
  }

  /**
   * Returns Trek current version.
   *
   * @static
   */
  static get version() {
    return this.package.version;
  }

  static get logger() {
    winston.default.transports.console.label = 'Trek';
    return this._logger || (this._logger = winston.cli());
  }

  static set logger(logger) {
    this._logger = logger;
  }

}

if (!global.Trek) {
  /**
   * Puts `Trek` to the global.
   *
   * @global
   */
  global.Trek = Trek;
}

