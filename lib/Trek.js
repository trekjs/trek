'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
/*!
 * trek - Trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _delegate = require('delegates');

var _delegate2 = _interopRequireWildcard(_delegate);

var _Engine2 = require('./Engine');

var _Engine3 = _interopRequireWildcard(_Engine2);

/**
 * @class Trek
 * @namespace Trek
 * @extends Engine
 * @param {String} rootPath The app root path.
 */

var Trek = (function (_Engine) {
  function Trek() {
    _classCallCheck(this, Trek);

    if (_Engine != null) {
      _Engine.apply(this, arguments);
    }
  }

  _inherits(Trek, _Engine);

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
    get: function () {
      return this._env || (this._env = process.env.TREK_ENV || process.env.NODE_ENV || 'development');
    }
  }, {
    key: 'isProduction',

    /**
     * Returns true if current environment is `production`.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return this.env === 'production';
    }
  }, {
    key: 'isDevelopment',

    /**
     * Returns true if current environment is `development`.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return this.env === 'development';
    }
  }, {
    key: 'isTest',

    /**
     * Returns true if current environment is `test`.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return this.env === 'test';
    }
  }, {
    key: 'package',

    /**
     * Returns Trek package information.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return require('../package.json');
    }
  }, {
    key: 'version',

    /**
     * Returns Trek current version.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return this['package'].version;
    }
  }, {
    key: 'lib',

    /**
     * Trek libs.
     *
     * @static
     * @memberof Trek
     */
    get: function () {
      return require('./lib');
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
  _delegate2['default'](Trek, 'lib').getter('logger').getter('Mailer');
}

exports['default'] = Trek;
module.exports = exports['default'];