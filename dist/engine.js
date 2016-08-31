'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _onFinished = require('on-finished');

var _onFinished2 = _interopRequireDefault(_onFinished);

var _trekMiddleware = require('trek-middleware');

var _trekMiddleware2 = _interopRequireDefault(_trekMiddleware);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Engine {

  constructor() {
    // just using raw req & raw res
    this.raw = false;
    this._init();
  }

  _init() {
    this.middleware = new _trekMiddleware2.default();
    this.config = new Map();
    this.config.set('subdomain offset', 2);
    this.config.set('trust proxy', false);
  }

  run() {
    var _this = this,
        _arguments = arguments;

    return _asyncToGenerator(function* () {
      const server = new _http.Server(function (req, res) {
        (0, _onFinished2.default)(res, function (err) {
          // handle err
          if (err) {
            console.log(err);
          }
        });
        _this.middleware.compose(_this.raw ? { req, res } : new _context2.default(_this, _this.config, req, res));
      });

      return yield server.listen(..._arguments);
    })();
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

}
exports.default = Engine;