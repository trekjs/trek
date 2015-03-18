/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import has from 'lodash-node/modern/object/has';
import delegate from 'delegates';
import Engine from './engine';

/**
 * Trek Secret Keys.
 * constant
 * @default
 * @private
 */
const TREK_KEYS = ['Star Trek', 'Spock', 'Trek'];

/**
 * @class Trek
 * @public
 */
class Trek extends Engine {

  /**
   * Returns the current Trek environment.
   *
   * @example
   *  Trek.env
   *  // => development | production | test
   *
   * @static
   * @public
   * @default 'development'
   * @return {String}
   */
  static get env() {
    return this._env || (this._env =
      process.env.TREK_ENV ||
      process.env.IOJS_ENV ||
      process.env.NODE_ENV ||
      'development');
  }

  /**
   * Returns true if current environment is `production`.
   *
   * @static
   * @public
   * @return {Boolean}
   */
  static get isProduction() {
    return this.env === 'production';
  }

  /**
   * Returns true if current environment is `development`.
   *
   * @static
   * @public
   * @return {Boolean}
   */
  static get isDevelopment() {
    return this.env === 'development';
  }

  /**
   * Returns true if current environment is `test`.
   *
   * @static
   * @return {Boolean}
   * @public
   */
  static get isTest() {
    return this.env === 'test';
  }

  /**
   * Returns Trek package information.
   *
   * @static
   * @public
   * @return {Object}
   */
  static get package() {
    return require('../package.json');
  }

  /**
   * Returns Trek current version.
   *
   * @static
   * @public
   * @return {String}
   */
  static get version() {
    return this.package.version;
  }

  /**
   * Trek app `keys`.
   *
   * @static
   * @public
   * @return {Array}
   */
  static get keys() {
    return TREK_KEYS;
  }

  /**
   * Trekking utility tools.
   *
   * @static
   * @public
   * @return {Object}
   */
  static get King() {
    return require('./king');
  }

}

/**
 * Puts `Trek` to the global.
 *
 * @global
 * @public
 * @return {Trek}
 */
if (!has(global, 'Trek')) {
  global.Trek = Trek;

  /**
   * Delegate getter to `Trek.King`.
   */
  delegate(Trek, 'King')
    .getter('_')
    .getter('joi')
    .getter('jwt')
    .getter('uuid')
    .getter('bcrypt')
    .getter('pbkdf2')
    .getter('logger')
    .getter('validator')
    .getter('Mailer')
    .getter('dotenv')
    .getter('debug');
}

export default global.Trek;