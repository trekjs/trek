/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _module2 = require('module');

var _module3 = _interopRequireDefault(_module2);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _toml = require('toml');

var _toml2 = _interopRequireDefault(_toml);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _babel = require('babel');

var babel = _interopRequireWildcard(_babel);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _Paths = require('./Paths');

var _Paths2 = _interopRequireDefault(_Paths);

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
    this.paths = new _Paths2['default'](this.root);
    // first load dotenv
    this.loadDotenv();
    // second, init nconf & load
    this.initStores();
  };

  Config.prototype.initStores = function initStores() {
    // nunjucks configure
    this.nunjucks = new _nunjucks2['default'].configure({
      autoescape: true
    });
    this.nunjucks.addGlobal('env', process.env);
    this.nunjucks.addGlobal('config', this);
    this.stores = new Map();
    this.loadConfigs();
  };

  /**
   * Load .env.{development|test|production}
   *
   * @method loadDotenv
   */

  Config.prototype.loadDotenv = function loadDotenv() {
    var env = this.paths.get('config/.env'); // .env.${Trek.env}
    var loaded = _dotenv2['default'].config({
      path: this.root + '/' + env,
      silent: true
    });
    if (loaded) Trek.logger.debug('Loaded environment variables from %s.', _chalk2['default'].green(env));else Trek.logger.warn('Missing %s or parse failed.', _chalk2['default'].red(env));
  };

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadConfigs
   */

  Config.prototype.loadConfigs = function loadConfigs() {
    var _this = this;

    var tmp = [];
    [[this.paths.get('config/database'), 'database', null, true, Trek.env], [this.paths.get('config/secrets'), 'secrets', null, true, Trek.env], [this.paths.get('config/app.env'), 'user'], // app.${Trek.env}
    [this.paths.get('config/app'), 'global'], [this.paths.get('config/.env'), 'env', new _nconf2['default'].Env()]]. // .env.${Trek.env}
    forEach(function (item) {
      var c = item[0];
      var t = item[1];
      var nc = item[2];
      var n = item[3];
      var e = item[4];
      var loaded = true;
      var err = null;

      try {
        var s = nc || _this.renderAndParse(_this.root + '/' + c, n ? t : null, e);
        _this.stores.set(t, s);
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

    for (var _iterator = this.stores.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var k = _ref[0];
      var s = _ref[1];

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
   * Use swig to render, then parse toml file to Memory.
   *
   * @method renderAndParse
   * @param {String} file The file path
   * @param {String} namespace Set a namespace for current store
   * @return {nconf.Memory}
   */

  Config.prototype.renderAndParse = function renderAndParse(filename, namespace, env) {
    var context = this.nunjucks.render(filename);
    var data = this.parse(filename, context);
    var memory = new _nconf2['default'].Memory({
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
    for (var _iterator2 = this.stores.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var s = _ref2;

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

  Config.prototype.parse = function parse(filename, context) {
    var ext = _path2['default'].extname(filename);
    if (ext === '.toml') {
      return _toml2['default'].parse(context);
    } else if (ext === '.json') {
      return _hjson2['default'].parse(context);
    } else if (ext === '.js') {
      var o = babel.transform(context);
      var m = new _module3['default'](filename, module);
      m._compile(o.code, filename);
      return m.exports;
    }
    return Object.create(null);
  };

  return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];