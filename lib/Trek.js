/*!
 * trek - Trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _Engine2 = require('./Engine');

var _Engine3 = _interopRequireDefault(_Engine2);

/**
 * Construct a Trek (app) instance
 *
 * @extends Engine
 */

var Trek = (function (_Engine) {
  _inherits(Trek, _Engine);

  function Trek() {
    _classCallCheck(this, Trek);

    _Engine.apply(this, arguments);
  }

  _createClass(Trek, null, [{
    key: 'env',

    /**
     * Returns the current Trek environment
     *
     * @example
     *  Trek.env
     *  // => development | production | test
     *
     * @static
     * @default 'development'
     * @returns {Boolean}
     */
    get: function get() {
      return this._env || (this._env = process.env.TREK_ENV || process.env.NODE_ENV || 'development');
    }

    /**
     * Returns true if current environment is `production`
     *
     * @static
     * @returns {Boolean}
     */
  }, {
    key: 'isProduction',
    get: function get() {
      return this.env === 'production';
    }

    /**
     * Returns true if current environment is `development`
     *
     * @static
     * @returns {Boolean}
     */
  }, {
    key: 'isDevelopment',
    get: function get() {
      return this.env === 'development';
    }

    /**
     * Returns true if current environment is `test`
     *
     * @static
     * @returns {Boolean}
     */
  }, {
    key: 'isTest',
    get: function get() {
      return this.env === 'test';
    }

    /**
     * Returns Trek package information
     *
     * @static
     * @returns {Object}
     */
  }, {
    key: 'package',
    get: function get() {
      return require('../package');
    }

    /**
     * Returns Trek current version
     *
     * @static
     * @returns {String}
     */
  }, {
    key: 'version',
    get: function get() {
      return this['package'].version;
    }

    /**
     * Gets Trek's logger
     *
     * @static
     * @returns {winston.Logger}
     */
  }, {
    key: 'logger',
    get: function get() {
      _winston2['default']['default'].transports.console.label = 'Trek';
      return this._logger || (this._logger = _winston2['default'].cli());
    },

    /**
     * Sets Trek's logger
     *
     * @static
     * @param {Object} logger
     * @returns {void}
     */
    set: function set(logger) {
      this._logger = logger;
    }
  }]);

  return Trek;
})(_Engine3['default']);

exports['default'] = Trek;

if (!global.Trek) {
  /**
   * Puts `Trek` to the global
   *
   * @global
   */
  global.Trek = Trek;
}
module.exports = exports['default'];