'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _Middleware = require('./Middleware');

var _Middleware2 = _interopRequireDefault(_Middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Trek extends _http.Server {

  constructor(requestListener) {
    super();
    this.middleware = new _Middleware2.default();
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  run(port = 3000, host = '0.0.0.0') {
    this.on('request', (req, res) => {
      this.middleware.compose({ req, res });
    });

    return new Promise((resolve, reject) => {
      this.listen(port, host, err => {
        err ? reject(err) : resolve();
      });
    });
  }

}
exports.default = Trek;