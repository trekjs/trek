'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _onFinished = require('on-finished');

var _onFinished2 = _interopRequireDefault(_onFinished);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Trek extends _http.Server {

  constructor() {
    super();
    this.middleware = new _middleware2.default();
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  run(port = 3000, host = '0.0.0.0') {
    // Lazy on request
    this.on('request', (req, res) => {
      (0, _onFinished2.default)(res, err => {
        // todo
      });
      this.middleware.compose({
        req: (0, _request2.default)(req),
        res: (0, _response2.default)(res)
      });
    });

    return new Promise((resolve, reject) => {
      this.listen(port, host, err => {
        err ? reject(err) : resolve();
      });
    });
  }

}
exports.default = Trek;