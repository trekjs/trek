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
class Trek extends Engine {

  /**
   * Returns the current Trek environment.
   *
   * @static
   * @memberof Trek
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
   * @memberof Trek
   */
  static get isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Returns true if current environment is `test`.
   *
   * @static
   * @memberof Trek
   */
  static get isTest() {
    return this.env === 'test';
  }

  /**
   * Returns Trek package information.
   *
   * @static
   * @memberof Trek
   */
  static get package() {
    return require('../package.json');
  }

  /**
   * Returns Trek current version.
   *
   * @static
   * @memberof Trek
   */
  static get version() {
    return this.package.version;
  }

  /**
   * Trek libs.
   *
   * @static
   * @memberof Trek
   */
  static get lib() {
    return require('./lib');
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

  /**
   * lib delegation.
   */
  /*
  delegate(Trek, 'lib')
    .getter('logger')
    .getter('Mailer');
  */
}

export default Trek;
