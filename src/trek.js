/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import has from 'lodash-node/modern/object/has';
import delegate from 'delegates';
import Engine from './engine';

const TREK_KEYS = ['Star Trek', 'Spock', 'Trek'];

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
   * @return {String}
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
   * Returns true if current environment is `production`.
   *
   * @static
   * @property isProduction
   * @return {Boolean}
   * @api public
   */
  static get isProduction() {
    return this.env === 'production';
  }

  /**
   * Returns true if current environment is `development`.
   *
   * @static
   * @property isDevelopment
   * @return {Boolean}
   * @api public
   */
  static get isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Returns true if current environment is `test`.
   *
   * @static
   * @property isTest
   * @return {Boolean}
   * @api public
   */
  static get isTest() {
    return this.env === 'test';
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
   * Trek app `keys`.
   *
   * @getter
   * @property
   * @return {Array}
   * @api public
   */
  static get keys() {
    return TREK_KEYS;
  }

  /**
   * Trekking utility tools.
   *
   * @getter
   * @property
   * @return {Object}
   * @api public
   */
  static get King() {
    return require('./king');
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
if (!has(global, 'Trek')) {
  global.Trek = Trek;

  /**
   * Delegate getter to `Trek.King`.
   */
  delegate(Trek, 'King')
    .getter('joi')
    .getter('jwt')
    .getter('uuid')
    .getter('bcrypt')
    .getter('pbkdf2')
    .getter('logger');
}

export default global.Trek;