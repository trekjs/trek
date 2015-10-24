/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _mzFs = require('mz/fs');

var _nconf = require('nconf');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _templatly = require('templatly');

var _templatly2 = _interopRequireDefault(_templatly);

var _Paths = require('./Paths');

var _Paths2 = _interopRequireDefault(_Paths);

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

/**
 * The app's configuration
 *
 * @example
 *
 *  const config = new Config('./your-config-folder')
 */

class Config {

  /**
   * @param {String} root The app's root path
   * @param {String} [separator='.'] The keypath separator
   */
  constructor(root) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

    this.root = root;
    this.separator = separator;
    this.initialize();
  }

  /**
   * @private
   */
  initialize() {
    this.parsers = _Parsers2['default'];
    this.paths = new _Paths2['default'](this.root);
    // init stores
    this.stores = new Map();
    // init list
    this.list = [
    // key, namespace, init store, enable/disable namespace, env
    ['config/database', 'database', null, true, Trek.env], ['config/secrets', 'secrets', null, true, Trek.env], ['config/app.env', 'user'], // app.${Trek.env}
    ['config/app', 'global'], ['config/.env', 'env', new _nconf.Env()]];
  }

  /**
   * Load dotenv `.env.{development|test|production}`
   *
   * @example
   *
   *  config.dotenv()
   *
   * @returns {void}
   */
  // .env.${Trek.env}
  dotenv() {
    var env = this.paths.get('config/.env'); // .env.${Trek.env}
    var existed = !!env;
    var loaded = false;
    if (existed) {
      loaded = _dotenv2['default'].config({
        path: `${ this.root }/${ env }`,
        silent: true
      });
    }
    env = env || this.paths.getPattern('config/.env');
    if (loaded) Trek.logger.debug('Loaded environment variables from %s to %s.', _chalk2['default'].green(env), _chalk2['default'].gray('process.env'));else Trek.logger.warn('Missing %s dotenv file or parse failed.', _chalk2['default'].red(env));
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @example
   *
   *  yield config.loadList()
   *
   * @returns {void}
   */
  *loadList() {
    var tmp = [];

    for (var item of this.list) {
      var k = item[0];
      var t = item[1];
      var nc = item[2];
      var n = item[3];
      var e = item[4];

      var p = this.paths.get(k);
      var existed = !!(p || nc);
      var loaded = true;
      var err = null;

      if (existed) {
        try {
          var s = nc || (yield this.compile(`${ this.root }/${ p }`, n ? t : null, e));
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
        error: err,
        namespace: t
      });
    }

    for (var _ref2 of this.stores.entries()) {
      var k = _ref2[0];
      var s = _ref2[1];

      s.loadSync();
    }

    tmp.forEach(function (e) {
      var pattern = e.pattern;
      var filename = e.filename;
      var loaded = e.loaded;
      var error = e.error;
      var namespace = e.namespace;

      filename = (namespace === 'env' ? 'process.env' : filename) || pattern;
      if (loaded) Trek.logger.debug('Loaded %s.', _chalk2['default'].green(filename));else Trek.logger.warn('Missing %s or parse failed, %s.', _chalk2['default'].red(filename), _chalk2['default'].red(error));
    });
  }

  /**
   * Load dotenv and app config files
   *
   * @example
   *
   *  yield config.load()
   *  // load steps
   *  // 0. config.dotenv()
   *  // 1. yield config.loadList()
   *
   * @returns {void}
   */
  *load() {
    // first, load dotenv
    this.dotenv();
    // second, load list
    yield this.loadList();
  }

  /**
   * Use templatly to render thie file, then parse file to Memory
   *
   * @example
   *
   *  yield config.compile('./your-config.json', 'user', 'test')
   *
   * @param {String} filename The file path
   * @param {String} namespace Set a namespace for current store
   * @param {String} env Select env if you want
   * @returns {nconf.Memory}
   */
  *compile(filename, namespace, env) {
    var content = yield this.render(filename);
    var data = this.parse(content, filename);
    var memory = new _nconf.Memory({
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
   * First, uses native `template-strings` for rendering configuration file
   *
   * @example
   *
   *  yield config.render('./your-config.yml', { name: 'your-app-name' })
   *
   * @param {String} filename The config file path
   * @param {Object} locals An object whose properties define local variables for the configuration
   * @returns {String} The rendered template strings
   */
  *render(filename) {
    var locals = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    var content = yield _mzFs.readFile(filename, 'utf-8');
    Object.assign(locals, {
      env: process.env,
      config: this
    });
    return _templatly2['default'](content, locals);
  }

  /**
   * Parse the file from `.js`, `.json`, `.toml`, `.yml` formatters.
   *
   * @example
   *
   *  config.parse(content, filename)
   *
   * @param {String} content The file raw content
   * @param {String} filename The file path
   * @returns {nconf.Memory}
   */
  parse(content, filename) {
    var ext = _path.extname(filename).substring(1);
    // parser
    var p = this.parsers[ext];
    if (!p) return Object.create(null);
    return p.parse(content, filename);
  }

  /**
   * Assigns setting key to value
   *
   * @example
   *
   *  config.set('port', 8080)
   *  config.set('app.name', 'trek')
   *
   * @param {String} key
   * @param {*} value
   * @param {String} [type='user'] The namespace is `user` by default
   * @returns {Config} this
   */
  set(key, value) {
    var type = arguments.length <= 2 || arguments[2] === undefined ? 'user' : arguments[2];

    if (this.stores.has(type)) {
      this.stores.get(type).set(key, value);
    }
    return this;
  }

  /**
   * Get value by key from Config
   *
   * @example
   *
   *  // search: env -> user -> global
   *  config.get('host')
   *  config.get('port', 80) // 80 by default
   *
   * @param {String} key
   * @param {*} [defaultValue]
   * @returns {*}
   */
  get(key, defaultValue) {
    var value = undefined;
    for (var s of this.stores.values()) {
      value = s.get(key);
      if (value) return value;
    }
    return defaultValue;
  }

}

exports['default'] = Config;
module.exports = exports['default'];