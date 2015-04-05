/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import toml from 'toml';
import chalk from 'chalk';
import nconf from 'nconf';
import dotenv from 'dotenv';
import Paths from './Paths';

/**
 * The app's configuration.
 *
 * @class Config
 * @param {String} root The app's root path
 * @param {String} separator The keypath separator
 */
class Config {
  constructor(root, separator = '.') {
    this.root = root;
    this.separator = separator;
    this.initialize();
  }

  initialize() {
    this.paths = new Paths(this.root);
    // first load dotenv
    this.loadDotenv();
    // second, init nconf & load
    this.initStores();
  }

  initStores() {
    //this.nconf = nconf.argv().env().use('memory');
    this.stores = new Map();
    this.stores.set('env', new nconf.Env());
    this.loadConfig();
    for (let s of this.stores.values()) {
      s.loadSync();
    }
  }

  /**
   * Load .env .env.{development|test|production}
   *
   * @method loadDotenv
   */
  loadDotenv() {
    [
      this.paths.get('config/.env.env'), // .env.${Trek.env}
      this.paths.get('config/.env')
    ].forEach((env) => {
      let [loaded, err] = [true, ''];
      try {
        loaded = dotenv.config({
          path: `${this.root}/${env}`
        });
      } catch (e) {
        err = e;
        loaded = false;
      }
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(env));
      else Trek.logger.debug('Missing %s or parse failed %s.', chalk.red(env), chalk.red(err));
    });
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadConfig
   */
  loadConfig() {
    [
      [this.paths.get('config/app.env'), 'user'], // app.${Trek.env}
      [this.paths.get('config/app'), 'global']
    ].forEach((item) => {
      let [c, t] = item;
      let [loaded, err] = [true, ''];
      try {
        this.stores.set(t, new nconf.File({
          file: `${this.root}/${c}`,
          format: toml,
          logicalSeparator: this.separator
        }));
      } catch (e) {
        err = e;
        loaded = false;
      }
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(c));
      else Trek.logger.debug('Missing %s or parse failed %s.', chalk.red(c), chalk.red(err));
    });
  }

  /**
   * Get value by key from Config.
   *
   *  search: env -> global -> user
   *
   * @method get
   * @param {String} key
   * @param {Mixed} [defaultValue]
   * @return {Mixed}
   */
  get(key, defaultValue) {
    let value;
    for (let s of this.stores.values()) {
      value = s.get(key);
      if (value) return value;
    }
    return defaultValue;
  }

  /**
   * Set value by key onto Config.
   *
   * @method set
   * @param {String} key
   * @param {Mixed} value
   * @param {String} [type='user']
   */
  set(key, value, type = 'user') {
    if (this.stores.has(type)) {
      this.stores.get(type).set(key, value);
    }
  }

}

export default Config;
