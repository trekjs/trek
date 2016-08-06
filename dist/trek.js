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
    // just using raw req & raw res
    this.raw = false;
    this.initConfig();
    this.middleware = new _middleware2.default();
  }

  initConfig() {
    this.config = new Map();
    this.config.set('subdomain offset', 2);
    this.config.set('trust proxy', false);
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  run() {
    // Lazy on request
    this.on('request', (req, res) => {
      (0, _onFinished2.default)(res, err => {
        // handle err
        if (err) {
          console.log(err);
        }
      });
      this.middleware.compose(this.raw ? { req, res } : new _context2.default(this, this.config, req, res));
    });

    try {
      return Promise.resolve(this.listen(...arguments));
    } catch (err) {
      return Promise.reject(err);
    }
  }

}
exports.default = Trek;