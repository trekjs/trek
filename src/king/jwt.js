/*!
 * trek/king/jwt
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import jwt from 'jsonwebtoken';

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
  return (done) => {
    jwt.verifySync(token, sign, options, done);
  };
}

export default jwt;
