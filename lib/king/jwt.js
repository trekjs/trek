"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var jwt = _interopRequire(require("jsonwebtoken"));

jwt.verifySync = jwt.verify;

jwt.verify = verify;

/**
 *    ```js
 *    let result = yield jwt.verify(token, sign, options);
 *    ```
 */
function verify(token, sign, options) {
  // Asynchronous
  return function (done) {
    jwt.verifySync(token, sign, options, done);
  };
}

module.exports = jwt;