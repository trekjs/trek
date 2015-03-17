import jwt from 'jsonwebtoken';

jwt.verifySync = jwt.verify;

jwt.verify = verify;

/**
 *    ```js
 *    let result = yield jwt.verify(token, sign, options);
 *    ```
 */
function verify(token, sign, options) {
  // Asynchronous
  return function(done) {
    jwt.verifySync(token, sign, options, done)
  }
}

export default jwt;