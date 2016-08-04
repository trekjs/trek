'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _onFinished = require('on-finished');

var _onFinished2 = _interopRequireDefault(_onFinished);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Trek extends _http.Server {

  constructor() {
    super();
    this.initConfig();
    this.middleware = new _middleware2.default();
  }

  initConfig() {
    this.config = new Map();
    this.config.set('proxy', false);
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
        // handle err
        if (err) {
          console.log(err);
        }
      });
      this.middleware.compose(new _context2.default(this, req, res));
    });

    return new Promise((resolve, reject) => {
      this.listen(port, host, err => err ? reject(err) : resolve());
    });
  }

}
exports.default = Trek;