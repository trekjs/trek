/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import vm from 'vm';
import path from 'path';
import Module from 'module';
import swig from 'swig';
import toml from 'toml';
import hjson from 'hjson';
import * as babel from 'babel';
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
    this.stores = new Map();
    this.loadConfigs();
  }

  /**
   * Load .env.{development|test|production}
   *
   * @method loadDotenv
   */
  loadDotenv() {
    let env = this.paths.get('config/.env'); // .env.${Trek.env}
    let loaded = dotenv.config({
      path: `${this.root}/${env}`,
      silent: true
    });
    if (loaded) Trek.logger.debug('Loaded environment variables from %s.', chalk.green(env));
    else Trek.logger.warn('Missing %s or parse failed.', chalk.red(env));
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadConfigs
   */
  loadConfigs() {
    let tmp = [];
    [
      [this.paths.get('config/database'), 'database', null, true, Trek.env],
      [this.paths.get('config/secrets'), 'secrets', null, true, Trek.env],
      [this.paths.get('config/app.env'), 'user'], // app.${Trek.env}
      [this.paths.get('config/app'), 'global'],
      [this.paths.get('config/.env'), 'env', new nconf.Env()], // .env.${Trek.env}
    ].forEach((item) => {
      let [c, t, nc, n, e] = item;
      let [loaded, err] = [true, null];
      try {
        let s = nc || (this.renderAndParse(`${this.root}/${c}`, n ? t : null, e));
        this.stores.set(t, s);
      } catch (e) {
        err = e;
        loaded = false;
      }
      tmp.unshift({
        filename: c,
        loaded: loaded,
        error: err
      });
    });

    for (let [k, s] of this.stores.entries()) {
      s.loadSync();
    }

    tmp.forEach((e) => {
      let {
        filename, loaded, error
      } = e;
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(filename));
      else Trek.logger.warn('Missing %s or parse failed, %s.', chalk.red(filename), chalk.red(error));
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
  renderAndParse(filename, namespace, env) {
    let context = swig.renderFile(filename);
    let data = this.parse(filename, context);
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
    memory.store = data || Object.create(null);
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

  parse(filename, context) {
    let ext = path.extname(filename);
    if (ext === '.toml') {
      return toml.parse(context);
    } else if (ext === '.json') {
      return hjson.parse(context);
    } else if (ext === '.js') {
      let o = babel.transform(context);
      let m = new Module(filename, module);
      m._compile(o.code, filename);
      return m.exports;
    }
    return Object.create(null);
  }

}

export default Config;
