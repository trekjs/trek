"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var jwt = _interopRequire(require("jsonwebtoken"));

jwt.verifySync = jwt.verify;

jwt.verify = verify;

/**
 * Asynchronous verify the token.
 *
 * @example
 *  let result = yield jwt.verify(token, sign, options);
 *
 * @method
 * @param {String} token
 * @param {String} sign
 * @param {Object} [options]
 * @return {Function}
 */
function verify(token, sign, options) {
  return function (done) {
    jwt.verifySync(token, sign, options, done);
  };
}

module.exports = jwt;