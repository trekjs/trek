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
 * @class Trek
 * @namespace Trek
 * @extends Engine
 * @param {String} rootPath The app root path.
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
     * Returns the current Trek environment.
     *
     * @static
     * @memberof Trek
     * @default 'development'
     *
     * @example
     *  Trek.env
     *  // => development | production | test
     */
    get: function get() {
      return this._env || (this._env = process.env.TREK_ENV || process.env.NODE_ENV || 'development');
    }

    /**
     * Returns true if current environment is `production`.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'isProduction',
    get: function get() {
      return this.env === 'production';
    }

    /**
     * Returns true if current environment is `development`.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'isDevelopment',
    get: function get() {
      return this.env === 'development';
    }

    /**
     * Returns true if current environment is `test`.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'isTest',
    get: function get() {
      return this.env === 'test';
    }

    /**
     * Returns Trek package information.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'package',
    get: function get() {
      return require('../package.json');
    }

    /**
     * Returns Trek current version.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'version',
    get: function get() {
      return this['package'].version;
    }

    /**
     * Trek libs.
     *
     * @static
     * @memberof Trek
     */
  }, {
    key: 'lib',
    get: function get() {
      return require('./lib');
    }
  }, {
    key: 'logger',
    get: function get() {
      _winston2['default']['default'].transports.console.label = 'Trek';
      return this._logger || (this._logger = _winston2['default'].cli());
    },
    set: function set(logger) {
      this._logger = logger;
    }
  }]);

  return Trek;
})(_Engine3['default']);

if (!global.Trek) {
  /**
   * Puts `Trek` to the global.
   *
   * @global
   */
  global.Trek = Trek;

  /**
   * lib delegation.
   */
  /*
  delegate(Trek, 'lib')
    .getter('logger')
    .getter('Mailer');
  */
}

exports['default'] = Trek;
module.exports = exports['default'];