/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import swig from 'swig';
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
    // swig settings
    swig.setDefaults({
      cache: false,
      locals: {
        env: process.env,
        config: this
      }
    });
    //this.nconf = nconf.argv().env().use('memory');
    this.stores = new Map();
    this.stores.set('env', new nconf.Env());
    this.loadConfigs();
    for (let s of this.stores.values()) {
      s.loadSync();
    }
  }

  /**
   * Load .env.{development|test|production}
   *
   * @method loadDotenv
   */
  loadDotenv() {
    let env = this.paths.get('config/.env.env'); // .env.${Trek.env}
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
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadConfigs
   */
  loadConfigs() {
    [
      [this.paths.get('config/secrets'), 'secrets', true, Trek.env],
      [this.paths.get('config/database'), 'database', true, Trek.env],
      [this.paths.get('config/app.env'), 'user'], // app.${Trek.env}
      [this.paths.get('config/app'), 'global']
    ].forEach((item) => {
      let [c, t, n, e] = item;
      let [loaded, err] = [true, ''];
      try {
        this.stores.set(t, this.renderAndParse(`${this.root}/${c}`, n ? t : null, e));
      } catch (e) {
        err = e;
        loaded = false;
      }
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(c));
      else Trek.logger.debug('Missing %s or parse failed %s.', chalk.red(c), chalk.red(err));
    });
  }

  /**
   * Use swig to render, then parse toml file to Memory.
   *
   * @method renderAndParse
   * @param {String} file The file path
   * @param {String} namespace Set a namespace for current store
   * @return {nconf.Memory}
   */
  renderAndParse(file, namespace, env) {
    let context = swig.renderFile(file);
    let data = toml.parse(context);
    let memory = new nconf.Memory({
      logicalSeparator: this.separator
    });
    // select env
    if (env) {
      data = data[env] || data;
    }
    // add namespace for data
    if (namespace) {
      data = {
        [namespace]: data
      };
    }
    memory.store = data || {};
    return memory;
  }

  /**
   * Get value by key from Config.
   *
   *  search: env -> user -> global
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
