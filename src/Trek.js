/*!
 * trek - Trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import winston from 'winston'
import Engine from './Engine'

/**
 * Construct a Trek (app) instance
 *
 * @extends {Engine}
 */

export default class Trek extends Engine {

  /**
   * Returns the current Trek environment
   *
   * @example
   *  Trek.env
   *  // => development | production | test
   *
   * @static
   * @default 'development'
   * @returns {Boolean}
   */
  static get env() {
    return this._env
      || (this._env = process.env.TREK_ENV
        || process.env.NODE_ENV
        || 'development')
  }

  /**
   * Returns true if current environment is `production`
   *
   * @static
   * @returns {Boolean}
   */
  static get isProduction() {
    return this.env === 'production'
  }

  /**
   * Returns true if current environment is `development`
   *
   * @static
   * @returns {Boolean}
   */
  static get isDevelopment() {
    return this.env === 'development'
  }

  /**
   * Returns true if current environment is `test`
   *
   * @static
   * @returns {Boolean}
   */
  static get isTest() {
    return this.env === 'test'
  }

  /**
   * Returns Trek package information
   *
   * @static
   * @returns {Object}
   */
  static get package() {
    return require('../package')
  }

  /**
   * Returns Trek current version
   *
   * @static
   * @returns {String}
   */
  static get version() {
    return this.package.version
  }

  /**
   * Gets Trek's logger
   *
   * @static
   * @returns {winston.Logger}
   */
  static get logger() {
    winston.default.transports.console.label = 'Trek'
    return this._logger || (this._logger = winston.cli())
  }

  /**
   * Sets Trek's logger
   *
   * @static
   * @param {Object} logger
   * @returns {void}
   */
  static set logger(logger) {
    this._logger = logger
  }

}

if (!global.Trek) {
  /**
   * Puts `Trek` to the global
   *
   * @global
   */
  global.Trek = Trek
}
