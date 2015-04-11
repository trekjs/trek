'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
/*!
 * trek - lib/logger
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var _chalk = require('chalk');

var _chalk2 = _interopRequireWildcard(_chalk);

var _winston = require('winston');

var _winston2 = _interopRequireWildcard(_winston);

var Logger = _winston2['default'].Logger;
var Console = _winston2['default'].transports.Console;

// Expose a Logger instance.
exports['default'] = new Logger({
  transports: [new Console({
    label: _chalk2['default'].green('Trek'),
    prettyPrint: true,
    colorize: true,
    level: Trek.isProduction ? 'info' : 'debug'
  })]
});
module.exports = exports['default'];