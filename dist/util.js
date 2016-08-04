'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileTrust = compileTrust;

var _proxyAddr = require('proxy-addr');

var _proxyAddr2 = _interopRequireDefault(_proxyAddr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */

function compileTrust(val) {
  if ('function' === typeof val) return val;

  if (true === val) {
    // Support plain true/false
    return () => true;
  }

  if ('number' === typeof val) {
    // Support trusting hop count
    return (a, i) => i < val;
  }

  if ('string' === typeof val) {
    // Support comma-separated values
    val = val.split(/ *, */);
  }

  return _proxyAddr2.default.compile(val || []);
}