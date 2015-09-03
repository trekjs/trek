/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _mzFs = require('mz/fs');

var _nconf = require('nconf');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _dotenv2 = require('dotenv');

var _dotenv3 = _interopRequireDefault(_dotenv2);

var _templatly = require('templatly');

var _templatly2 = _interopRequireDefault(_templatly);

var _Paths = require('./Paths');

var _Paths2 = _interopRequireDefault(_Paths);

var _Parsers = require('./Parsers');

var _Parsers2 = _interopRequireDefault(_Parsers);

/**
 * The app's configuration.
 *
 * @class Config
 * @param {String} root The app's root path
 * @param {String} separator The keypath separator
 */

var Config = (function () {
  function Config(root) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

    _classCallCheck(this, Config);

    this.root = root;
    this.separator = separator;
    this.initialize();
  }

  Config.prototype.initialize = function initialize() {
    this.parsers = _Parsers2['default'];
    this.paths = new _Paths2['default'](this.root);
    // init stores
    this.stores = new Map();
    // init list
    this.list = [[this.paths.get('config/database'), 'database', null, true, Trek.env], [this.paths.get('config/secrets'), 'secrets', null, true, Trek.env], [this.paths.get('config/app.env'), 'user'], // app.${Trek.env}
    [this.paths.get('config/app'), 'global'], [this.paths.get('config/.env'), 'env', new _nconf.Env()]];
  };

  /**
   * Load .env.{development|test|production}
   *
   * @method dotenv
   */
  // .env.${Trek.env}

  Config.prototype.dotenv = function dotenv() {
    var env = this.paths.get('config/.env'); // .env.${Trek.env}
    var loaded = _dotenv3['default'].config({
      path: `${ this.root }/${ env }`,
      silent: true
    });
    if (loaded) Trek.logger.debug('Loaded environment variables from %s.', _chalk2['default'].green(env));else Trek.logger.warn('Missing %s or parse failed.', _chalk2['default'].red(env));
  };

  Config.prototype.load = function* load() {
    // first, load dotenv
    this.dotenv();
    // second, load list
    yield this.loadList();
  };

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadList
   */

  Config.prototype.loadList = function* loadList() {
    var tmp = [];

    for (var _iterator = this.list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var item = _ref;
      var c = item[0];
      var t = item[1];
      var nc = item[2];
      var n = item[3];
      var e = item[4];
      var loaded = true;
      var err = null;

      try {
        var s = nc || (yield this.compile(`${ this.root }/${ c }`, n ? t : null, e));
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
    }

    for (var _iterator2 = this.stores.entries(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var k = _ref2[0];
      var s = _ref2[1];

      s.loadSync();
    }

    tmp.forEach(function (e) {
      var filename = e.filename;
      var loaded = e.loaded;
      var error = e.error;

      if (loaded) Trek.logger.debug('Loaded %s.', _chalk2['default'].green(filename));else Trek.logger.warn('Missing %s or parse failed, %s.', _chalk2['default'].red(filename), _chalk2['default'].red(error));
    });
  };

  /**
   * Use templatly to render thie file, then parse file to Memory.
   *
   * @method compile
   * @param {String} filename The file path.
   * @param {String} namespace Set a namespace for current store.
   * @param {String} env
   * @return {nconf.Memory}
   */

  Config.prototype.compile = function* compile(filename, namespace, env) {
    var context = yield this.render(filename);
    var data = this.parse(context, filename);
    var memory = new _nconf.Memory({
      logicalSeparator: this.separator
    });
    // select env
    if (env) {
      data = data[env] || data;
    }
    // add namespace for data
    if (namespace) {
      var _data;

      data = (_data = {}, _data[namespace] = data, _data);
    }
    memory.store = data || Object.create(null);
    return memory;
  };

  /**
   * First, uses native `template-strings` for reandering configuration file.
   *
   * @method render
   */

  Config.prototype.render = function* render(filename) {
    var locals = arguments.length <= 1 || arguments[1] === undefined ? Object.create(null) : arguments[1];

    var context = yield _mzFs.readFile(filename, 'utf-8');
    locals = _lodash2['default'].assign(locals, {
      env: process.env,
      config: this
    });
    return _templatly2['default'](context, locals);
  };

  /**
   * Parse the file from `.js`, `.json`, `.toml`.
   *
   * @method parse
   * @param {String} context The file raw context.
   * @param {String} filename The file path.
   * @return {nconf.Memory}
   */

  Config.prototype.parse = function parse(context, filename) {
    var ext = _path.extname(filename).substring(1);
    // parser
    var p = this.parsers[ext];
    if (!p) return Object.create(null);
    return p.parse(context, filename);
  };

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

  Config.prototype.get = function get(key, defaultValue) {
    var value = undefined;
    for (var _iterator3 = this.stores.values(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var s = _ref3;

      value = s.get(key);
      if (value) return value;
    }
    return defaultValue;
  };

  /**
   * Set value by key onto Config.
   *
   * @method set
   * @param {String} key
   * @param {Mixed} value
   * @param {String} [type='user']
   */

  Config.prototype.set = function set(key, value) {
    var type = arguments.length <= 2 || arguments[2] === undefined ? 'user' : arguments[2];

    if (this.stores.has(type)) {
      this.stores.get(type).set(key, value);
    }
  };

  return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];