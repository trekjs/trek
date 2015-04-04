'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _toml = require('toml');

var _toml2 = _interopRequireWildcard(_toml);

var _chalk = require('chalk');

var _chalk2 = _interopRequireWildcard(_chalk);

var _nconf = require('nconf');

var _nconf2 = _interopRequireWildcard(_nconf);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireWildcard(_dotenv);

var _Paths = require('./Paths');

var _Paths2 = _interopRequireWildcard(_Paths);

/**
 * The app's configuration.
 *
 * @class Config
 * @param {String} root The app's root path
 * @param {String} separator The keypath separator
 */

let Config = (function () {
  function Config(root) {
    let separator = arguments[1] === undefined ? '.' : arguments[1];

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
    //this.nconf = nconf.argv().env().use('memory');
    this.stores = new Map();
    this.stores.set('env', new _nconf2['default'].Env());
    this.loadConfig();
    for (var _iterator = this.stores.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      let s = _ref;

      s.loadSync();
    }
  };

  /**
   * Load .env .env.{development|test|production}
   *
   * @method loadDotenv
   */

  Config.prototype.loadDotenv = function loadDotenv() {
    var _this = this;

    [this.paths.get('config/.env.env'), // .env.${Trek.env}
    this.paths.get('config/.env')].forEach(function (env) {
      let loaded = true;
      let err = '';

      try {
        loaded = _dotenv2['default'].config({
          path: `${ _this.root }/${ env }`
        });
      } catch (e) {
        err = e;
        loaded = false;
      }
      if (loaded) Trek.logger.debug('Loaded %s.', _chalk2['default'].green(env));else Trek.logger.debug('Missing %s or parse failed %s.', _chalk2['default'].red(env), _chalk2['default'].red(err));
    });
  };

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @method loadConfig
   */

  Config.prototype.loadConfig = function loadConfig() {
    var _this2 = this;

    [[this.paths.get('config/app.env'), 'global'], // app.${Trek.env}
    [this.paths.get('config/app'), 'user']].forEach(function (item) {
      let c = item[0];
      let t = item[1];
      let loaded = true;
      let err = '';

      try {
        _this2.stores.set(t, new _nconf2['default'].File({
          file: `${ _this2.root }/${ c }`,
          format: _toml2['default'],
          logicalSeparator: _this2.separator
        }));
      } catch (e) {
        err = e;
        loaded = false;
      }
      if (loaded) Trek.logger.debug('Loaded %s.', _chalk2['default'].green(c));else Trek.logger.debug('Missing %s or parse failed %s.', _chalk2['default'].red(c), _chalk2['default'].red(err));
    });
  };

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

  Config.prototype.get = function get(key, defaultValue) {
    let value;
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

      let s = _ref2;

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
    let type = arguments[2] === undefined ? 'user' : arguments[2];

    if (this.stores.has(type)) {
      this.stores.get(type).set(key, value);
    }
  };

  return Config;
})();

exports['default'] = Config;
module.exports = exports['default'];