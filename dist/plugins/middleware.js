'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trekMiddleware = require('trek-middleware');

var _trekMiddleware2 = _interopRequireDefault(_trekMiddleware);

var _trekEngine = require('trek-engine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

Object.assign(_trekMiddleware2.default, {

  install(app) {
    const middleware = new _trekMiddleware2.default();

    Reflect.defineProperty(app, 'middleware', { value: middleware });

    return middleware;
  }

});

Object.assign(_trekMiddleware2.default.prototype, {

  running(app, req, res) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.compose(app.raw ? { req, res } : new _trekEngine.Context(app, app.config, req, res));
    })();
  },

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.push(fn);
    return this;
  }

});

exports.default = _trekMiddleware2.default;