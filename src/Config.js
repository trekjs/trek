/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { extname} from 'path';
import { readFile } from 'mz/fs';
import { Env, Memory } from 'nconf';
import chalk from 'chalk';
import dotenv from 'dotenv';
import templatly from 'templatly';
import Paths from './Paths';
import Parsers from './Parsers';

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
    this.parsers = Parsers;
    this.paths = new Paths(this.root);
    // init stores
    this.stores = new Map();
    // init list
    this.list = [
      ['config/database', 'database', null, true, Trek.env],
      ['config/secrets', 'secrets', null, true, Trek.env],
      ['config/app.env', 'user'], // app.${Trek.env}
      ['config/app', 'global'],
      ['config/.env', 'env', new Env()], // .env.${Trek.env}
    ];
  }

  /**
   * Load .env.{development|test|production}
   *
   * @method dotenv
   */
  dotenv() {
    let env = this.paths.get('config/.env'); // .env.${Trek.env}
    let loaded = dotenv.config({
      path: `${this.root}/${env}`,
      silent: true
    });
    if (loaded) Trek.logger.debug('Loaded environment variables from %s.', chalk.green(env));
    else Trek.logger.warn('Missing %s or parse failed.', chalk.red(env));
  }

  *load() {
    // first, load dotenv
    this.dotenv();
    // second, load list
    yield this.loadList();
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadList
   */
  *loadList() {
    let tmp = [];

    for (let item of this.list) {
      let [k, t, nc, n, e] = item;
      let p = this.paths.get(k);
      let [existed, loaded, err] = [!!p, true, null];
      if (existed) {
        try {
          let s = nc || (yield this.compile(`${this.root}/${p}`, n ? t : null, e));
          this.stores.set(t, s);
        } catch (e) {
          err = e;
          loaded = false;
        }
      }
      tmp.unshift({
        pattern: this.paths.getPattern(k),
        filename: p,
        loaded: existed & loaded,
        error: err
      });
    }

    for (let [k, s] of this.stores.entries()) {
      s.loadSync();
    }

    tmp.forEach((e) => {
      let {
        pattern, filename, loaded, error
      } = e;
      filename = filename || pattern;
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(filename));
      else Trek.logger.warn('Missing %s or parse failed, %s.', chalk.red(filename), chalk.red(error));
    });
  }

  /**
   * Use templatly to render thie file, then parse file to Memory.
   *
   * @method compile
   * @param {String} filename The file path.
   * @param {String} namespace Set a namespace for current store.
   * @param {String} env
   * @return {nconf.Memory}
   */
  *compile(filename, namespace, env) {
    let context = yield this.render(filename);
    let data = this.parse(context, filename);
    let memory = new Memory({
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
   * First, uses native `template-strings` for reandering configuration file.
   *
   * @method render
   */
  *render(filename, locals = Object.create(null)) {
    let context = yield readFile(filename, 'utf-8');
    Object.assign(locals, {
      env: process.env,
      config: this
    });
    return templatly(context, locals);
  }

  /**
   * Parse the file from `.js`, `.json`, `.toml`.
   *
   * @method parse
   * @param {String} context The file raw context.
   * @param {String} filename The file path.
   * @return {nconf.Memory}
   */
  parse(context, filename) {
    let ext = extname(filename).substring(1);
    // parser
    let p = this.parsers[ext];
    if (!p) return Object.create(null);
    return p.parse(context, filename);
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
